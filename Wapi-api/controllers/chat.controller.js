import { Message, ContactTag, ChatNote, User, ChatAssignment, WhatsappConnection, Contact, Tag, WhatsappPhoneNumber } from '../models/index.js';
import mongoose from 'mongoose';

const validateWhatsAppConnection = async (userId) => {
  const connection = await WhatsappConnection.findOne({
    user_id: userId,
    is_active: true,
    deleted_at: null
  });

  if (!connection) {
    return {
      isConnected: false,
      error: 'WhatsApp Business API not connected',
      phoneNumber: null
    };
  }

  return {
    isConnected: true,
    phoneNumber: connection.registred_phone_number,
    connection
  };
};

const validateAndFilterIds = (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return {
      isValid: false,
      message: 'IDs array is required and must not be empty',
      validIds: []
    };
  }

  const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

  if (validIds.length === 0) {
    return {
      isValid: false,
      message: 'No valid IDs provided',
      validIds: []
    };
  }

  return {
    isValid: true,
    validIds
  };
};

const fetchUniqueContactNumbers = async (myPhoneNumber) => {
  const sentMessages = await Message.distinct('recipient_number', {
    sender_number: myPhoneNumber,
    recipient_number: { $ne: null },
    deleted_at: null
  });

  const receivedMessages = await Message.distinct('sender_number', {
    recipient_number: myPhoneNumber,
    sender_number: { $ne: null },
    deleted_at: null
  });

  const allContactNumbers = [
    ...new Set([
      ...sentMessages.filter(Boolean),
      ...receivedMessages.filter(Boolean)
    ])
  ].filter(number => number && number !== myPhoneNumber);

  return allContactNumbers;
};

const createLabelMap = (labels) => {
  return labels.reduce((acc, item) => {
    if (!acc[item.recipient_number]) {
      acc[item.recipient_number] = [];
    }
    acc[item.recipient_number].push(item.label);
    return acc;
  }, {});
};

const fetchLastMessage = async (myPhoneNumber, contactNumber) => {
  const lastMessage = await Message.findOne({
    $or: [
      {
        sender_number: myPhoneNumber,
        recipient_number: contactNumber,
        deleted_at: null
      },
      {
        sender_number: contactNumber,
        recipient_number: myPhoneNumber,
        deleted_at: null
      }
    ]
  })
    .sort({ wa_timestamp: -1 })
    .lean();

  if (!lastMessage) {
    return null;
  }

  return {
    id: lastMessage._id.toString(),
    content: lastMessage.content,
    messageType: lastMessage.message_type,
    fileUrl: lastMessage.file_url,
    direction: lastMessage.direction,
    fromMe: lastMessage.from_me,
    createdAt: lastMessage.wa_timestamp
  };
};

const sortChatsByLastMessage = (chats) => {
  return chats.sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
  });
};

export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const connectionStatus = await validateWhatsAppConnection(userId);
    if (!connectionStatus.isConnected) {
      return res.status(400).json({
        success: false,
        error: connectionStatus.error
      });
    }

    const myPhoneNumber = connectionStatus.phoneNumber;

    const allContactNumbers = await fetchUniqueContactNumbers(myPhoneNumber);

    let filteredContactNumbers = allContactNumbers;

    if (req.user.role === 'agent') {
      const assignments = await ChatAssignment.find({
        agent_id: userId,
        $or: [{ status: 'assigned' }, { status: { $exists: false } }]
      }).select('sender_number receiver_number').lean();

      const assignedNumbers = new Set();

      assignments.forEach(a => {
        if (a.sender_number !== myPhoneNumber) assignedNumbers.add(a.sender_number);
        if (a.receiver_number !== myPhoneNumber) assignedNumbers.add(a.receiver_number);
      });

      filteredContactNumbers = allContactNumbers.filter(num =>
        assignedNumbers.has(num)
      );
    }

    const labels = await ChatLabel.find({
      sender_number: myPhoneNumber,
      recipient_number: { $in: filteredContactNumbers },
      deleted_at: null
    })
      .select('recipient_number label')
      .lean();

    const labelMap = createLabelMap(labels);

    const contacts = await Contact.find({
      phone_number: { $in: filteredContactNumbers },
      created_by: userId,
      deleted_at: null
    }).select('phone_number chat_status').lean();

    const contactStatusMap = contacts.reduce((acc, c) => {
      acc[c.phone_number] = c.chat_status || 'open';
      return acc;
    }, {});

    const recentChats = await Promise.all(
      filteredContactNumbers.map(async (contactNumber) => {
        const lastMessage = await fetchLastMessage(myPhoneNumber, contactNumber);

        return {
          contact: {
            number: contactNumber,
            name: contactNumber,
            avatar: null,
            labels: labelMap[contactNumber] || [],
            chat_status: contactStatusMap[contactNumber] || 'open'
          },
          lastMessage
        };
      })
    );

    const sortedChats = sortChatsByLastMessage(recentChats);

    return res.json({
      success: true,
      data: sortedChats
    });
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch recent chats',
      message: error.message
    });
  }
};


export const addTag = async (req, res) => {
  try {
    const { contact_id, tag_id } = req.body;

    if (!contact_id || !tag_id) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID and tag ID are required'
      });
    }

    let userId = req.user.id;

    if (req.user.role === 'agent') {
      const agent = await User.findById(userId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      userId = agent.created_by;
    }

    const contact = await Contact.findOne({
      _id: contact_id,
      created_by: userId,
      deleted_at: null
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const tag = await Tag.findOne({
      _id: tag_id,
      created_by: userId,
      deleted_at: null
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    const existingTag = await ContactTag.findOne({
      contact_id: contact_id,
      tag_id: tag_id,
      deleted_at: null
    });

    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: 'Tag already assigned to this contact'
      });
    }

    const newTagAssignment = await ContactTag.create({
      contact_id: contact_id,
      tag_id: tag_id
    });

    if (!contact.tags.includes(tag_id)) {
      contact.tags.push(tag_id);
      await contact.save();
    }

    await tag.incrementUsage();

    return res.status(201).json({
      success: true,
      message: 'Tag assigned successfully',
      data: {
        id: newTagAssignment._id.toString(),
        contactId: newTagAssignment.contact_id,
        tagId: newTagAssignment.tag_id,
        createdAt: newTagAssignment.created_at
      }
    });
  } catch (error) {
    console.error('Error adding tag:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add tag',
      error: error.message
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { tagId, contactId } = req.body;

    if (!tagId || !contactId) {
      return res.status(400).json({
        success: false,
        message: 'tagId and contactId are required'
      });
    }

    let userId = req.user.id;

    if (req.user.role === 'agent') {
      const agent = await User.findById(userId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      userId = agent.created_by;
    }

    const contact = await Contact.findOne({
      _id: contactId,
      created_by: userId,
      deleted_at: null
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or unauthorized'
      });
    }

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    const tagIndex = contact.tags.indexOf(tagId);
    if (tagIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Tag is not assigned to this contact'
      });
    }

    contact.tags.splice(tagIndex, 1);
    await contact.save();

    await tag.decrementUsage();

    await ContactTag.deleteOne({
      contact_id: contactId,
      tag_id: tagId
    });

    return res.status(200).json({
      success: true,
      message: 'Tag removed from contact successfully',
      data: {
        contactId: contact._id,
        tagId: tag._id
      }
    });
  } catch (error) {
    console.error('Error removing tag from contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove tag from contact',
      error: error.message
    });
  }
};

export const addNote = async (req, res) => {
  try {
    const { contact_id, whatsapp_phone_number_id, note } = req.body;

    if (!contact_id || !whatsapp_phone_number_id || !note) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID, WhatsApp phone number ID, and note are required'
      });
    }

    if (note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note cannot be empty'
      });
    }

    let userId = req.user.id;

    if (req.user.role === 'agent') {
      const agent = await User.findById(userId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      userId = agent.created_by;
    }

    const contact = await Contact.findOne({
      _id: contact_id,
      created_by: userId,
      deleted_at: null
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const whatsappPhoneNumber = await WhatsappPhoneNumber.findOne({
      _id: whatsapp_phone_number_id,
      user_id: userId,
      deleted_at: null
    });

    if (!whatsappPhoneNumber) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp phone number not found'
      });
    }

    const newNote = await ChatNote.create({
      contact_id: contact_id,
      whatsapp_phone_number_id: whatsapp_phone_number_id,
      note: note.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        id: newNote._id.toString(),
        contactId: newNote.contact_id,
        whatsappPhoneNumberId: newNote.whatsapp_phone_number_id,
        note: newNote.note,
        createdAt: newNote.created_at
      }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { ids } = req.body;

    const validation = validateAndFilterIds(ids);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const { validIds } = validation;
    let userId = req.user.id;

    if (req.user.role === 'agent') {
      const agent = await User.findById(userId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }

      userId = agent.created_by;
    }

    const existingNotes = await ChatNote.find({
      _id: { $in: validIds },
      deleted_at: null
    }).populate('contact_id');

    if (existingNotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No chat notes found with the provided IDs'
      });
    }

    const userContactIds = existingNotes
      .map(note => note.contact_id?._id?.toString())
      .filter(id => id);

    const userContacts = await Contact.find({
      _id: { $in: userContactIds },
      created_by: userId,
      deleted_at: null
    });

    const userContactIdSet = new Set(userContacts.map(c => c._id.toString()));
    const validNotes = existingNotes.filter(note =>
      note.contact_id && userContactIdSet.has(note.contact_id._id.toString())
    );

    if (validNotes.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No authorized chat notes found'
      });
    }

    const foundIds = validNotes.map(note => note._id.toString());
    const notFoundIds = validIds.filter(id => !foundIds.includes(id.toString()));

    const deleteResult = await ChatNote.deleteMany({ _id: { $in: foundIds } });

    const response = {
      success: true,
      message: `${deleteResult.deletedCount} chat note(s) deleted successfully`,
      data: {
        deletedCount: deleteResult.deletedCount,
        deletedIds: foundIds
      }
    };

    if (notFoundIds.length > 0) {
      response.data.notFoundIds = notFoundIds;
      response.message += `, ${notFoundIds.length} note(s) not found or unauthorized`;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notes',
      error: error.message
    });
  }
};

export const getChatLabels = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    const userId = req.user.id;

    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Contact number is required'
      });
    }

    const connectionStatus = await validateWhatsAppConnection(userId);
    if (!connectionStatus.isConnected) {
      return res.status(400).json({
        success: false,
        message: connectionStatus.error
      });
    }

    const myPhoneNumber = connectionStatus.phoneNumber;

    const labels = await ChatLabel.find({
      sender_number: myPhoneNumber,
      recipient_number: contactNumber,
      deleted_at: null
    })
      .select('label created_at')
      .sort({ created_at: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: labels
    });
  } catch (error) {
    console.error('Error fetching chat labels:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch chat labels',
      error: error.message
    });
  }
};

export const getChatTags = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contact_id } = req.query;

    if (!contact_id) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID is required'
      });
    }

    const contact = await Contact.findOne({
      _id: contact_id,
      created_by: userId,
      deleted_at: null
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const contactTags = await ContactTag.find({
      contact_id: contact_id,
      deleted_at: null
    })
      .populate({
        path: 'tag_id',
        select: '_id label color'
      })
      .select('_id contact_id tag_id created_at');

    const tags = contactTags.map(ct => ({
      id: ct._id.toString(),
      tag: ct.tag_id,
      createdAt: ct.created_at
    }));

    return res.status(200).json({
      success: true,
      message: 'Chat tags retrieved successfully',
      data: {
        tags,
        count: tags.length
      }
    });
  } catch (error) {
    console.error('Error getting chat tags:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get chat tags',
      error: error.message
    });
  }
};

export const getChatNotes = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    const userId = req.user.id;

    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Contact number is required'
      });
    }

    const connectionStatus = await validateWhatsAppConnection(userId);
    if (!connectionStatus.isConnected) {
      return res.status(400).json({
        success: false,
        message: connectionStatus.error
      });
    }

    const myPhoneNumber = connectionStatus.phoneNumber;

    const notes = await ChatNote.find({
      sender_number: myPhoneNumber,
      recipient_number: contactNumber,
      deleted_at: null
    })
      .select('note created_at')
      .sort({ created_at: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching chat notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch chat notes',
      error: error.message
    });
  }
};

export const assignChatToAgent = async (req, res) => {
  try {
    const { contact_id, whatsapp_phone_number_id, agent_id, chatbot_id } = req.body;
    const adminId = req.user.id;

    if (!contact_id || !whatsapp_phone_number_id || (!agent_id && !chatbot_id)) {
      return res.status(400).json({
        success: false,
        message: 'contact_id, whatsapp_phone_number_id, and either agent_id or chatbot_id are required'
      });
    }

    if (agent_id && !mongoose.Types.ObjectId.isValid(agent_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    if (chatbot_id && !mongoose.Types.ObjectId.isValid(chatbot_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chatbot ID'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(whatsapp_phone_number_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid whatsapp_phone_number_id'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contact_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact_id'
      });
    }

    const contact = await Contact.findById(contact_id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (agent_id) {
      const agent = await User.findOne({
        _id: agent_id,
        role: 'agent'
      });

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'Agent not found'
        });
      }
    }

    if (chatbot_id) {
      const ChatbotModel = mongoose.model('Chatbot');
      const chatbot = await ChatbotModel.findOne({
        _id: chatbot_id,
        user_id: adminId,
        deleted_at: null
      });

      if (!chatbot) {
        return res.status(404).json({
          success: false,
          message: 'Chatbot not found or you do not own it'
        });
      }
    }


    const phoneNumber = await WhatsappPhoneNumber.findOne({
      _id: whatsapp_phone_number_id,
      user_id: adminId,
      deleted_at: null
    });

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp phone number not found or you do not own it'
      });
    }

    const contactPhoneNumber = contact.phone_number;
    const businessPhoneNumber = phoneNumber.display_phone_number;

    const sender_number = contactPhoneNumber;
    const receiver_number = businessPhoneNumber;

    const chatMatch = {
      $or: [
        { sender_number: contactPhoneNumber, receiver_number: businessPhoneNumber },
        { sender_number: businessPhoneNumber, receiver_number: contactPhoneNumber }
      ]
    };
    const statusMatch = { $or: [{ status: 'assigned' }, { status: { $exists: false } }] };

    const existingAssignment = await ChatAssignment.findOne({
      whatsapp_phone_number_id,
      $and: [chatMatch, statusMatch]
    });

    let assignment;

    if (existingAssignment) {
      existingAssignment.agent_id = agent_id;
      existingAssignment.assigned_by = adminId;
      existingAssignment.status = 'assigned';
      existingAssignment.updated_at = new Date();

      assignment = await existingAssignment.save();

      return res.status(200).json({
        success: true,
        message: 'Chat reassigned successfully',
        data: assignment
      });
    } else {
      assignment = await ChatAssignment.create({
        sender_number,
        receiver_number,
        agent_id: agent_id || null,
        chatbot_id: chatbot_id || null,
        assigned_by: adminId,
        whatsapp_phone_number_id,
        status: 'assigned'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Chat assigned successfully',
      data: assignment
    });

  } catch (error) {
    console.error('Error assigning chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign chat',
      error: error.message
    });
  }
};

export const unassignChatFromAgent = async (req, res) => {
  try {
    const { contact_id, whatsapp_phone_number_id } = req.body;
    const adminId = req.user.id;

    if (!contact_id || !whatsapp_phone_number_id) {
      return res.status(400).json({
        success: false,
        message: 'contact_id and whatsapp_phone_number_id are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(whatsapp_phone_number_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid whatsapp_phone_number_id'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contact_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact_id'
      });
    }

    const contact = await Contact.findById(contact_id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const phoneNumber = await WhatsappPhoneNumber.findOne({
      _id: whatsapp_phone_number_id,
      user_id: adminId,
      deleted_at: null
    });

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp phone number not found or you do not own it'
      });
    }

    const contactPhoneNumber = contact.phone_number;
    const businessPhoneNumber = phoneNumber.display_phone_number;

    const chatMatch = {
      $or: [
        { sender_number: contactPhoneNumber, receiver_number: businessPhoneNumber },
        { sender_number: businessPhoneNumber, receiver_number: contactPhoneNumber }
      ]
    };

    const assignment = await ChatAssignment.findOne({
      whatsapp_phone_number_id,
      ...chatMatch,
      status: 'assigned'
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'No active assignment found for this chat'
      });
    }

    assignment.status = 'unassigned';
    assignment.updated_at = new Date();
    await assignment.save();

    return res.status(200).json({
      success: true,
      message: 'Chat unassigned from agent successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error unassigning chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unassign chat',
      error: error.message
    });
  }
};

export const updateChatStatus = async (req, res) => {
  try {
    const { contact_id, status, whatsapp_phone_number_id } = req.body;
    const userId = req.user.id;

    if (!contact_id || !status || !whatsapp_phone_number_id) {
      return res.status(400).json({
        success: false,
        message: 'contact_id, status and whatsapp_phone_number_id are required'
      });
    }

    if (!['open', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "open" or "resolved"'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(whatsapp_phone_number_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid whatsapp_phone_number_id'
      });
    }

    const contact = await Contact.findOne({
      _id: contact_id,
      created_by: userId,
      deleted_at: null
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const phoneNumber = await WhatsappPhoneNumber.findOne({
      _id: whatsapp_phone_number_id,
      user_id: userId,
      deleted_at: null
    });

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp phone number not found or you do not own it'
      });
    }

    const oldStatus = contact.chat_status || 'open';
    if (oldStatus === status) {
      return res.status(200).json({
        success: true,
        message: `Chat is already ${status}`,
        data: contact
      });
    }

    contact.chat_status = status;
    await contact.save();

    // Update ChatAssignment if exists and status is resolved
    if (status === 'resolved') {
      await ChatAssignment.updateMany(
        {
          $or: [
            { sender_number: contact.phone_number },
            { receiver_number: contact.phone_number }
          ],
          status: 'assigned'
        },
        { is_solved: true }
      );
    } else if (status === 'open') {
      await ChatAssignment.updateMany(
        {
          $or: [
            { sender_number: contact.phone_number },
            { receiver_number: contact.phone_number }
          ],
          status: 'assigned'
        },
        { is_solved: false }
      );
    }

    // Create system message
    const systemMessageContent = status === 'resolved'
      ? 'user marked this chat as resolved'
      : 'user marked this chat as open';

    const myPhoneNumber = phoneNumber.display_phone_number;

    await Message.create({
      contact_id: contact._id,
      user_id: userId,
      content: systemMessageContent,
      message_type: 'system_messages',
      direction: 'outbound',
      from_me: true,
      sender_number: myPhoneNumber,
      recipient_number: contact.phone_number,
      whatsapp_connection_id: phoneNumber.whatsapp_connection_id || null,
      wa_timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Chat status updated to ${status}`,
      data: contact
    });
  } catch (error) {
    console.error('Error updating chat status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update chat status',
      error: error.message
    });
  }
};

export default {
  getRecentChats,
  addTag,
  deleteTag,
  addNote,
  deleteNote,
  getChatTags,
  getChatNotes,
  assignChatToAgent,
  unassignChatFromAgent,
  updateChatStatus
};

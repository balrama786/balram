import React from "react";
import { ChatMessage, MessageGroup as MessageGroupType } from "@/src/types/components/chat";
import MessageItem from "./MessageItem";
import CollapsibleSystemMessages from "./CollapsibleSystemMessages";

interface MessageGroupProps {
  group: MessageGroupType;
  onImageClick?: (url: string) => void;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ group, onImageClick }) => {
  // Partition messages into streaks of system messages and streaks of non-system messages
  const partitionedMessages = group.messages.reduce((acc, msg, i) => {
    if (i === 0) {
      acc.push([msg]);
      return acc;
    }
    const lastGroup = acc[acc.length - 1];
    const lastMsg = lastGroup[lastGroup.length - 1];

    const isLastSystem = lastMsg.messageType === "system_messages";
    const isCurrSystem = msg.messageType === "system_messages";

    if (isLastSystem && isCurrSystem) {
      lastGroup.push(msg);
    } else {
      acc.push([msg]);
    }
    return acc;
  }, [] as ChatMessage[][]);

  return (
    <div className="flex flex-col space-y-0.5 gap-2">
      {partitionedMessages.map((subGroup, subIndex) => {
        const isSystemStreak = subGroup[0].messageType === "system_messages";

        if (isSystemStreak && subGroup.length > 2) {
          return <CollapsibleSystemMessages key={`sys-group-${subIndex}`} messages={subGroup} />;
        }

        return subGroup.map((message) => (
          <MessageItem key={message.id} message={message} onImageClick={onImageClick} />
        ));
      })}
    </div>
  );
};

export default MessageGroup;

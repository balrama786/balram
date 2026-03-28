import axios from 'axios';
import fs from 'fs';
import path from 'path';


export function parseIncomingMessage(message) {
  let content = null;
  let mediaId = null;
  let fileType = null;
  let mimeType = null;
  let interactiveId = null;
  let replyMessageId = null;
  let reactionMessageId = null;
  let reactionEmoji = null;

  if (message.context && message.context.id) {
    replyMessageId = message.context.id;
  }

  switch (message.type) {
    case "text":
      content = message.text.body;
      break;

    case "image":
      mediaId = message.image.id;
      mimeType = message.image.mime_type;
      content = message.image.caption || null;
      fileType = "image";
      break;

    case "video":
      mediaId = message.video.id;
      mimeType = message.video.mime_type;
      content = message.video.caption || null;
      fileType = "video";
      break;

    case "audio":
      mediaId = message.audio.id;
      mimeType = message.audio.mime_type;
      fileType = "audio";
      break;

    case "document":
      mediaId = message.document.id;
      mimeType = message.document.mime_type;
      content = message.document.filename;
      fileType = "document";
      break;

    case "location":
      content = JSON.stringify({
        latitude: message.location.latitude,
        longitude: message.location.longitude,
        name: message.location.name || null,
        address: message.location.address || null,
      });
      fileType = "location";
      break;

    case "interactive":
      console.log("message.interactive" , message.interactive)
      if (message.interactive?.button_reply) {
        interactiveId = message.interactive.button_reply.id;
        content = message.interactive.button_reply.title;
        fileType = "button_reply";
      } else if (message.interactive?.list_reply) {
        interactiveId = message.interactive.list_reply.id;
        content = message.interactive.list_reply.title;
        fileType = "list_reply";
      }

      else if(message.interactive?.call_permission_reply) {
        if(message.interactive?.call_permission_reply.response === "reject")
        {
          content = "call permission is rejected"
        } else if(message.interactive?.call_permission_reply.response === "accept" && !message.interactive?.call_permission_reply.is_permanent) {
          content = "call permission is allowed"
        }
        else if(message.interactive?.call_permission_reply.response === "accept" && message.interactive?.call_permission_reply.is_permanent) {
          content = "call permission is allowed temporarily"
        }
      }
      console.log("content" , content)
      break;

    case "reaction":
      reactionMessageId = message.reaction.message_id;
      reactionEmoji = message.reaction.emoji;
      content = message.reaction.emoji; // store the emoji in the content field as well
      fileType = "reaction";
      break;

    default:
      fileType = "unknown";
  }

  let interactiveData = null;
  if (message.type === "interactive") {
    interactiveData = message.interactive;
  }

  return { content, mediaId, fileType, mimeType, interactiveId, interactiveData, replyMessageId, reactionMessageId, reactionEmoji };
}


export async function getWhatsAppMediaUrl(mediaId, access_token) {
  const res = await axios.get(
    `https://graph.facebook.com/v19.0/${mediaId}`,
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );

  return res.data.url;
}


export function getExtension(mimeType, fallback = "bin") {
  if (!mimeType) return fallback;

  const map = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "audio/ogg": "ogg",
      "audio/mpeg": "mp3",
      "application/pdf": "pdf"
  };

  return map[mimeType] || mimeType.split("/")[1] || fallback;
}


export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }
}


export async function downloadAndStoreMedia(url, accessToken, mimeType, fileType) {
  const ext = getExtension(mimeType);
  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const safeType = fileType || "other";

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "whatsapp",
    safeType
  );

  ensureDir(uploadDir);

  const filePath = path.join(uploadDir, filename);

  const response = await axios.get(url, {
    responseType: "stream",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    response.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return `/uploads/whatsapp/${safeType}/${filename}`;
}

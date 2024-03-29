import { error, json } from "@sveltejs/kit";
import { createMimeMessage, Mailbox } from "mimetext";

import type { RequestHandler } from "./$types";

import { email } from "$lib/db/schema";
import { drizzle } from "$lib/server/drizzle";
import { auth } from "$lib/server/lucia";

type AttachmentBase = {
  filename: string;
  contentType: string;
  data: string;
};

type NonInlineAttachment = AttachmentBase & {
  inline: false;
};

type InlineAttachment = AttachmentBase & {
  inline: true;
  contentId: string;
};

type Attachment = NonInlineAttachment | InlineAttachment;

type EmailSendRequest = {
  recipient: string;
  replyTo: string;
  subject: string;
  plaintextBody: string;
  htmlBody: string;
  attachments?: Attachment[];
};

export const POST: RequestHandler = async (event) => {
  const session = await auth.handleRequest(event).validate();
  if (!session || session.user.role === "UNAUTHORIZED") {
    throw error(401);
  }
  const requests: EmailSendRequest[] = await event.request.json();
  const messages = requests.map(
    ({ attachments, htmlBody, plaintextBody, recipient, replyTo, subject }) => {
      const msg = createMimeMessage();
      msg.setSender({ name: "ICS Student Council", addr: "icssc@uci.edu" });
      msg.setHeader("Reply-To", new Mailbox(replyTo));
      msg.setRecipient(recipient);
      msg.setSubject(subject);
      msg.addMessage({ contentType: "text/plain", data: plaintextBody });
      msg.addMessage({ contentType: "text/html", data: htmlBody });
      for (const attachment of attachments ?? []) {
        const { filename, contentType, data, inline } = attachment;
        msg.addAttachment({
          filename,
          contentType,
          data,
          inline,
          headers: attachment.inline ? { "Content-ID": attachment.contentId } : undefined,
        });
      }
      return { raw: msg.asEncoded() };
    },
  );
  return json(await drizzle.insert(email).values(messages).returning({ id: email.id }));
};

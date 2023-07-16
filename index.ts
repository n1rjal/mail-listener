import { MailListener } from "mail-listener5";
import axios from "axios";
import Joi from "joi";
import { config } from "dotenv";
import FormData from "form-data";

if (process.env.ENV_FILE) {
  console.log("ENV_FILE", process.env.ENV_FILE);
  config({
    path: process.env.ENV_FILE,
  });
}

const envSchema = Joi.object({
  USERNAME: Joi.string().required(),
  PASSWORD: Joi.string().required(),
  HOST: Joi.string().required(),
  PORT: Joi.number().required(),
  WEBHOOK_URL: Joi.string().required(),
});

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const envVars = { USERNAME, PASSWORD, HOST, PORT, WEBHOOK_URL };

const { error } = envSchema.validate(envVars);
if (error) {
  throw error.details.map(({ message }) => message).join(", ");
}

var mailListener = new MailListener({
  username: USERNAME,
  password: PASSWORD,
  host: HOST,
  port: PORT,
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  autotls: "never", // default by node-imap
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "./attachments/" }, // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function () {
  console.log("imapConnected");
});

mailListener.on("mailbox", function (mailbox: any) {
  console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
});

mailListener.on("server:disconnected", function () {
  console.log("imapDisconnected");
});

mailListener.on("error", function (err: any) {
  console.log(err);
});

mailListener.on("mail", function (mail: any) {
  // do something with the whole email as a single object
  const attachments = mail.attachments;
  const html = mail.html as string;
  const text = mail.text as string;
  const from = mail.from.value as string;
  const to = mail.to.value as string;

  const data = { html, text, from, to };

  const formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (["number", "string", "boolean"].includes(typeof value))
      formData.append(key, value.toString());
    if (["array", "object"].includes(typeof value))
      formData.append(key, JSON.stringify(value));
  }

  for (const attachment of attachments) {
    formData.append("attachments", attachment.content);
  }

  axios
    .post(WEBHOOK_URL!, formData, formData.getHeaders())
    .then((d) => {})
    .catch((e) => {
      throw e;
    });
});

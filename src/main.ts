import input from "input";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { mapTelegramProxyString } from "./utils";
import type { TelegramDevice } from "./types";
import os from "os";
import { NewMessage } from "telegram/events";
import { sleep } from "bun";

export async function loginByUser(device: TelegramDevice) {
  const sessionString = await input.text(
    "Enter your session string (or leave empty to new login): "
  );
  const session = new StringSession(sessionString.trim());
  const proxy = await input.text("Please enter telegram proxy (optional): ");

  const client = new TelegramClient(session, device.apiId, device.apiHash, {
    appVersion: device.appVersion,
    deviceModel: device.deviceModel,
    systemVersion: device.systemVersion,
    langCode: "en",
    systemLangCode: "en",
    proxy: mapTelegramProxyString(proxy.trim()),
  });

  await client.connect();
  console.log("Connected to Telegram");

  if (await client.checkAuthorization()) {
    console.log("You are already authorized");
  } else {
    console.log("You are not authorized");
    await client.signInUser(
      {
        apiId: device.apiId,
        apiHash: device.apiHash,
      },
      {
        phoneNumber: async () =>
          await input.text("Please enter telegram phone number: "),
        password: async (hint?: string) =>
          await input.text(
            `Please enter telegram password${hint ? ` (hint: ${hint})` : ""}: `
          ),
        phoneCode: async (inApp?: boolean) =>
          await input.text(
            `Please enter telegram ${inApp ? "in-app" : "SMS"} login code: `
          ),
        onError: (err) => {
          throw err;
        },
      }
    );
    console.log("Successfully logged in");
  }

  const savedSession = session.save();
  console.log(`Here is your session string:\n${savedSession}`);

  const action: string = await input.text('Do you want to log incoming messages? (y/n): ');
  if (action.trim().toLowerCase() === 'y') {
    client.addEventHandler(async (event) => {
      console.log(`\nNew message in chat ${event.message.chat?.id}: ${event.message.text.replaceAll('\n', '\\n')}`)
    }, new NewMessage())

    while(true) {
      await sleep(60*1000)
    }
  }

  await client.disconnect();
}

async function main() {
  require("dotenv").config();

  const apiId = process.env.TELEGRAM_API_ID;
  const apiHash = process.env.TELEGRAM_API_HASH;
  if (!apiId) throw new Error("env TELEGRAM_API_ID is required");
  if (!apiHash) throw new Error("env TELEGRAM_API_HASH is required");

  const appVersion = process.env.TELEGRAM_APP_VERSION || "1.0";
  const deviceModel = process.env.TELEGRAM_DEVICE_MODEL || os.type().toString();
  const systemVersion =
    process.env.TELEGRAM_SYSTEM_VERSION || os.release().toString();

  await loginByUser({
    apiId: Number(apiId),
    apiHash: apiHash,
    deviceModel: deviceModel,
    systemVersion: systemVersion,
    appVersion: appVersion,
  });
}
main();

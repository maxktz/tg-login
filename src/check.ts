import input from "input";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { mapTelegramProxyString } from "./utils";
import type { TelegramDevice } from "./types";
import { defaultDevices } from "./constants";

export interface TelegramLoginParams {
  device: TelegramDevice;
}

export async function checkSession({ device }: TelegramLoginParams) {
  const proxy = await input.text("Please enter telegram proxy (optional): ");

  const sessionString = await input.text("Please enter the session string: ");

  const session = new StringSession(sessionString.trim());

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
    console.log("You are authorized");
  } else {
    console.log("You are not authorized");
  }

  const savedSession = session.save();
  console.log(`Here is your session string:\n${savedSession}`);
  await client.disconnect();
}

async function main() {
  await checkSession({
    device: defaultDevices.macbookAirM1,
  });
}
main();

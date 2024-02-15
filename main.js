import TuyaDevice from "tuyapi";
import { uIOhook, UiohookKey } from "uiohook-napi";
import config from "./config.json" assert { type: "json" };

const tuya = new TuyaDevice({
  id: config.id,
  ip: config.ip,
  key: config.key,
  version: config.version,
});

await tuya.connect();

const toggle = async () => {
  const properties = await tuya.get({
    schema: true,
    dps: config.source,
  });

  const status = properties.dps[config.source];

  const value = !status;

  await tuya.set({
    multiple: true,
    data: config.targets.reduce((obj, target) => {
      obj[target] = value;
      return obj;
    }, {}),
  });
};

uIOhook.on("keydown", (e) => {
  if (e.keycode !== UiohookKey.F8) return;

  if (e.ctrlKey && e.altKey && e.shiftKey) {
    uIOhook.stop();
    tuya.disconnect();

    return;
  }

  toggle();
});

uIOhook.start();

const TuyaDevice = require("tuyapi/index")
import config from "./config.json" with { type: "json" };

const tuya = new TuyaDevice({
  id: config.id,
  ip: config.ip,
  key: config.key,
  version: config.version,
});

await tuya.connect();

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

tuya.disconnect();

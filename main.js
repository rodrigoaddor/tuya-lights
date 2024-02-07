import TuyAPI from "tuyapi";
import config from "./config.json" with { type: "json" };

const tuya = new TuyAPI({
  id: config.id,
  ip: config.ip,
  key: config.key,
  version: config.version,
});

await tuya.find();
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

// for (const target of config.targets) {
//     await tuya.set({
//         set: value,
//         dps: target
//     })
// }

tuya.disconnect();

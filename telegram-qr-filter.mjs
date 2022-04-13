#!/usr/bin/env node
import { walk } from "files";
import { readFile, writeFile } from "fs/promises";
import jimp from "jimp";
import { basename, resolve } from "path";
import QrCode from "qrcode-reader";
import yaml from "yaml";

// const args = arg({"-i"});

const outdir = "output";

const defaultDir = process.env.USERPROFILE + "/Downloads/Telegram Desktop";
const imgsDir = resolve(defaultDir);
const ls = await walk(imgsDir + "/").filter(/\.png$/);
const outputyaml = resolve(outdir + "/output.yaml");
console.log("telegram image count: ", ls.length);
ls.sort(() => (Math.random() > 0.5 ? 1 : -1));

const currentObjs = await readFile(outputyaml, "utf8")
  .then(yaml.parse)
  .catch(() => ({}));
for await (const fn of ls) {
  // skip if existed
  if (currentObjs[fn]) {
    console.log("skip: " + fn);
    continue;
  }
  const value = await imgFileQrCodeParse(fn);
  const qrObj = { [fn]: { fn, value } };
  Object.assign(currentObjs, qrObj);
}
await writeFile(outputyaml, yaml.stringify(currentObjs));
console.log("telegram-qr-filter all done");

async function imgFileQrCodeParse(fn) {
  console.log("loading: " + fn);
  const buf = await readFile(fn);
  // console.log(fn, "reading");
  const img = await jimp.read(buf);
  // console.log(fn, "readed");
  //   img.resize(1024, 1024);
  img.contain(512, 512);
  // img.quality(20);
  // img.grayscale();

  const qr = new QrCode();
  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => (err ? reject(err) : resolve(v));
    qr.decode(img.bitmap);
  }).catch((e) => null);
  const fnBasename = basename(fn);
  if (value) {
    console.log("done", fnBasename, value?.result);
    await img.writeAsync(outdir + "/" + fnBasename);
  } else {
    console.log("fail", fnBasename);
  }
  // console.log(fn, value);
  return value;
}

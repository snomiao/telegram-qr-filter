import { walk } from "files";
import { readFile } from "fs/promises";
import jimp from "jimp";
import { basename, resolve } from "path";
import QrCode from "qrcode-reader";

const defaultDir = process.env.USERPROFILE + "/Downloads/Telegram Desktop";
const imgsDir = resolve(defaultDir);
const ls = await walk(imgsDir + "/").filter(/\.png$/);
console.log(ls);
ls.sort(() => (Math.random() > 0.5 ? 1 : -1));

for await (const fn of ls) {
  await imgFileQrCodeParse(fn);
}

async function imgFileQrCodeParse(fn) {
  console.log(fn, "loading");
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
    await img.writeAsync("output/" + fnBasename);
    await img.writeAsync("output/" );
  } else {
    console.log("fail", fnBasename);
  }
  // console.log(fn, value);
  return value;
}

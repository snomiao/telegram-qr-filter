# Telegram-qr-filter

Scan all QRCode from "%USERPROFILE%/Downloads/Telegram Desktop" and output to ./output

Currently support windows only

## Usage

run cmd.exe

```batch
mkdir telegram-qrcodes
cd telegram-qrcodes
npx telegram-qr-filter

@REM see your files
start "" .\output
code .\output\output.yaml
```

## Usage

使用情景范例：在上海封城期间，社区团购自救需求大量出现，使用 efb 连接微信，然后用这个脚本扫描所有 telegram 自动下载的图片，然后筛选出所有带二维码的图片，再筛选一下时间即可得到最近出现的团购群，然后就可以依次扫码加群。

> Usage scenario example: during the city closure in Shanghai, the community group purchase self-help demand appeared in large numbers, use efb to connect to WeChat, then use this script to scan all the pictures automatically downloaded by telegram, then filter all the pictures with QR code, then filter the time to get the recently appeared group purchase group, then you can scan the code to add the group in turn.
>
> Translated with www.DeepL.com/Translator (free version)

# 0.3 WOL-RPI [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
## Requirements

- NodeJS v22.20 or newer
- PM2 (lighter than Docker, run in background)
## Installation

### We'll install this on ubuntu server 24.04 LTS

First, install the required dependecies if not install

```bash
  sudo apt update && sudo apt upgrade
  sudo apt install nodejs
  sudo apt install -g pm2
```

Now, let's install the project and start it.

```bash
  wget -O https://github/...
```

Then, let's start it

```bash
  cd wol-rpi
  pm2 start ./wol-rpi/server/index.mjs --name "wol-rpi"
  pm2 save
  pm2 startup
```

Now, to access your server, just run

```bash
  ifconfig
```

And in your browser, just do http://your-rpi-address and your done.
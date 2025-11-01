# 0.3 WOL-RPI [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Wake-on-LAN tool to start a devices through a web service for Rasberry Pi.
Lightweight and fast with **SQLite** & **PM2**.

## Requirements

- **NodeJS** >= v22.20
- **PM2** (recommended: lighter than Docker, runs in background)


## Installation

### Tested on **Ubuntu Server 24.04 LTS** on a **Rasberry Pi 4 8GB**

1. Install the required dependencies (if not already installed):

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git
sudo npm install pm2@latest -g
```

2. Install the project and go in

```bash
git clone https://github.com/seb-dev-62/wol-rpi.git
cd wol-rpi
```

3. Install the packages and build it!

```bash
npm install
npm run build
```

4. A .output folder will be created (it's hidden, so don't be surprised if you don't see it.)
Now, we well copy it to the home or wherever you want.

```bash
cp -r .output ~/wol-rpi-build
cd ~/wol-rpi-build
pm2 start ./server/index.mjs --name "wol-rpi-service"
pm2 save
pm2 startup
```

Now, to access your server, just run

```bash
ifconfig
```

And in your browser, just do http://<your-rpi-address> and you're done.
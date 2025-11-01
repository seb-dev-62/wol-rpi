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

4. A **.output** folder will be created (it's hidden, so don't be surprised if you don't see it.)
Now, copy it to the home or wherever you want

```bash
cp -r .output ~/wol-rpi-build
cd ~/wol-rpi-build
```

5. Create the **.env** to use the back-end

```bash
sudo nano .env
```

6. Start the server with PM2

```bash
pm2 start ./server/index.mjs "wol-rpi-service"
pm2 save
pm2 startup
```

And past this, you may adjust according to your config
For the **JWT_SECRET** create a 32 characters password
(i.e: hcoYG$CpoJKa!AjpL#33axyFb@d#@6mH - do not use this exact password!)
[![A free password generator](https://www.lastpass.com/features/password-generator?utm_source=google&utm_medium=cpc&utm_campaign=19418169524&utm_term=password%20generator&utm_content=147367465160&gad_source=1&gad_campaignid=19418169524&gclid=Cj0KCQjw35bIBhDqARIsAGjd-cY_pxu_f8zQF8ZBezw-m_dQZIJKp59kKBKYSpbou0sdOGDQETMVXM0aAoFkEALw_wcB)]

```bash
DATABASE_URL="file:./db/init.db"
JWT_SECRET="<Your secrete code>"
```

Now, to access your server, just run

```bash
ifconfig
```

And in your browser, just do http://<your-rpi-address> and you're done.
# Pi-Control 🐱‍👤
Welcome to Pi-Control 🐱‍👤.  
This is an App for controlling your raspberry pi.  
It was designed to help with information gathering, as well as to simplify control. 

![Pi-Control Mockup](/screenshots/mockup.png?raw=true "Pi-Control Mockup")

## Requirements
- **NodeJS**: `16.x`
- **Yarn**: `1.22.x`
- **Npm**: _not testet (optional)_
  
# Installation

## One-Step Automated Install

Those who want to get started quickly and conveniently may install Pi-Control 🐱‍👤 using the following command:

### `curl -sSL https://raw.githubusercontent.com/borsTiHD/pi-control/main/installer/basic-install.sh | sudo bash`

The script checks all needed dependencies and will ask you if you want to install an additional service.  
With the service you can control the app: ```sudo service picontrol (start|stop|status)```  

## Alternative Install Method
Download the latest version from releases: [Release / Download](https://github.com/borsTiHD/pi-control/releases)  
Create and change to the subdirectory ```/opt/pi-control```.  
Extract the archive and install dependencies with ```yarn install```.  
```bash
$ cd /opt/pi-control
$ yarn install # or npm install
$ sudo yarn start # or sudo npm start
```

This way you need to manually start the app with the ```sudo yarn start``` command.  
You can also take care of your own way of running the app in the background, etc.  
Examples: pm2 ('ecosystem.json' included), node-linux (you can use the script in ```./installer/service.cjs```), etc.  

-----

## First time accessing the app

After installation, you can access the app through your browser.  
Go to: ```http://{hostname|ip}:8800```  
  
After a fresh installation no user is set up yet. Please follow the registration request.  
Your user data will be stored locally and hashed with a unique key.  
  
If you forget your password, you can delete the file with the stored data ```/opt/pi-control/db.json```, then you will be asked to register again.

-----

## Update the app

For updating you can use the same installation script.  
It also takes care of transferring your data to the new version.  
For a manual update, the old app must be deleted and reinstalled.  

-----

## Changing Port

You can change the default port (```8800```) by creating/editing the ```/opt/pi-control/.env``` file and adding the following value there:  ```PORT_PRODUCTION=8888```
After the change, you need to restart the app and you can access the app with the new port.  
Go to: ```http://{hostname|ip}:8888```

-----
  
# Contribution
If you want to contribute to this project, please take a look into the wiki:  
- https://github.com/borsTiHD/pi-control/wiki

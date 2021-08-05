# Pi-Control 🐱‍👤
Welcome to Pi-Control 🐱‍👤.  
This is an App for controlling your raspberry pi.  
It was designed to help with information gathering, as well as to simplify control. 

## Requirements
- **NodeJS**: `16.x`
- **Yarn**: `1.22.x`
- **Npm**: _not testet (optional)_

## Install & running the app
Download the latest version from releases: [Release / Download](https://github.com/borsTiHD/pi-control/releases)  
Extract the archive, change to the subdirectory, install dependencies and start the app:  
```bash
$ cd pi-control
$ yarn install # npm install
$ sudo yarn start # sudo npm start
```

# Deploy with [pm2](https://pm2.keymetrics.io/) (run as a service with start on reboot, or crash)
If you want to run the app in the background, or do you want to open the app automatically on restart, you can use pm2.
```bash
# maybe you need to add 'sudo' for every command, even to start 'pm2' service so it can edit files for example

# yarn pm2 install
$ yarn global add pm2

# or npm pm2 install
$ npm install pm2 -g

# start app (localhost:8800) - without 'sudo' the process has not enough rights for writing files
$ sudo pm2 start ecosystem.json
```

### Additional pm2 commands
```bash
# check status by
$ sudo pm2 ls

# make pm2 auto-boot at server restart:
$ sudo pm2 startup

# remove auto-boot service
$ sudo pm2 unstartup systemd

# stopping service
$ sudo pm2 stop pi-control

# adding instances in ecosystem.config.js by setting the number to 'max' for instances on every cpu core
# after a change in the setting file, you need to 'delete' saved apps in pm2
$ sudo pm2 delete all
```

# Contribution
If you want to contribute to this project, please take a look into the wiki:  
- https://github.com/borsTiHD/pi-control/wiki

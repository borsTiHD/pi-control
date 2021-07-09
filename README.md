# pi-control

## Requirements
- NodeJS: 16.x
- Yarn: 1.22.x

## Install & running the app

Download the latest version from releases: https://github.com/borsTiHD/pi-control/releases  
Extract the archive, change to the subdirectory and start the app with the following command:  
```bash
$ sudo yarn start
```

## Deploy with pm2 (run as a service with start on reboot, or crash)

```bash
# maybe you need to add 'sudo' for every command, even to start 'pm2' service so it can edit files for example

# yarn pm2 install
$ yarn global add pm2

# or npm pm2 install
$ npm install pm2 -g

# start app (localhost:8800) - without 'sudo' the process has not enough rights for writing files
$ sudo pm2 start ecosystem.json
```

## Additional pm2 commands

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

## Contribution

If you want to contribute to this project, please take a look into the wiki:  
- https://github.com/borsTiHD/pi-control/wiki

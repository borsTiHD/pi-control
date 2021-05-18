# pi-control

## Preperations (one time)

```bash
# maybe you need to add 'sudo' for every command, even to start 'pm2' service so it can edit files for example

# install nodejs
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
$ sudo apt install nodejs

# verify the installation
$ node -v

# install yarn
$ npm install --global yarn

# verify the installation
$ yarn -v

# clone repo
$ git clone ...
$ cd pi-control
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server (localhost:8800)
$ yarn build
$ yarn start
```

## Deploy with pm2 for normal use

```bash
# make sure you build the app first as mentioned in 'Build Setup'
# yarn pm2 install
$ yarn global add pm2

# or npm pm2 install
$ npm install pm2 -g

# start app (localhost:8800) - without 'sudo' the process has not enough rights for writing files
$ pm2 start
```

## Additional pm2 commands

```bash
# check status by
$ pm2 ls

# make pm2 auto-boot at server restart:
$ pm2 startup

# remove auto-boot service
$ pm2 unstartup systemd

# stopping service
$ pm2 stop pi-control

# adding instances in ecosystem.config.js by setting the number to 'max' for instances on every cpu core
# after a change in the setting file, you need to 'delete' saved apps in pm2
$ pm2 delete all
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

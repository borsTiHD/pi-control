# pi-control

## Preperations (one time)

```bash
# install nodejs
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
$ sudo apt install nodejs

# verify the installation
$ node -v

# install yarn
$ npm install --global yarn

# verify the installation
$ yarn -v
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

## Deploy with pm2 for normal use
```bash
# make sure you build the app first as mentioned in 'Build Setup'
# yarn pm2 install
$ yarn global add pm2 --prefix /usr/local

# start app
$ pm2 start

# check status by
$ pm2 ls
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

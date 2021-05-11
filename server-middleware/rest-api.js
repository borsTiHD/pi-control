const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json())

app.all('/', (req, res) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

app.all('/help', (req, res) => {
    console.log('PLEASE HELP ME!')
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

module.exports = app

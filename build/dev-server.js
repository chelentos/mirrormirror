var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var fs = require('fs')
var http = require('http')
var https = require('https')

var port = 8080

var options = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/certificate.pem'),
}

var app = express()
var compiler = webpack(config)

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))

// enable hot-reload and state-preserving
// compilation error display
app.use(require('webpack-hot-middleware')(compiler))

var server = https.createServer(options, app).listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at https://localhost:'+port)
})
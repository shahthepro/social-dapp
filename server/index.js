require('dotenv').config()

const express = require('express')
const app = express()

const https = require('https');
const fs = require('fs');

const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const RedisStore = require('connect-redis')(session)

const {
  REDIS_HOST,
  REDIS_PORT,
  SESSION_NAME,
  SESSION_SECRET,
  PORT
} = process.env

const sessionStore = new RedisStore({
  host: REDIS_HOST,
  port: REDIS_PORT,
  logErrors: true
})

const sessionConfig = {
  store: sessionStore,
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  ttl: 360000
}

app.use(session(sessionConfig))
app.use(express.json())
app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(async (req, res, next) => {
  req.redisSessionStore = sessionStore
  next()
})

app.use(require('./controllers'))

const port = PORT || 4000

https.createServer({
  key: fs.readFileSync('./security/key.pem'),
  cert: fs.readFileSync('./security/cert.pem'),
  passphrase: process.env.SSL_CERT_PASSPHRASE
}, app)
.listen(port, () => {
  console.log(`API server running on port ${port}`)
});
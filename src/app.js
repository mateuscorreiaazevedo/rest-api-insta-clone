const router = require('./routes/router')
const env = require('./config/env')
const express = require('express')
const path = require('path')
const cors = require('cors')
const connect = require('./service/db')

const port = env.port
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({credentials: true, origin: env.appUrl}))

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(router)

app.listen(port, () => {
  console.log(`app ready ${port}`)
  connect()
})
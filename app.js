const express = require('express')
const cors = require('cors')
require('dotenv').config()

const kamarRoutes = require('./routes/kamarRoutes')
const seasonRoutes = require('./routes/seasonRoutes')
const fasilitasTambahanRoutes = require('./routes/fasilitasTambahanRoutes')
const tarifRoutes = require('./routes/tarifRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const customerGroupRoutes = require('./routes/customerGroupRoutes')
const transaksiRoutes = require('./routes/transaksiRoutes')

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const version = process.env.API_VERSION || 'v1'
const extendUrl = `/api/${version}`

app.use(`${extendUrl}`, kamarRoutes)
app.use(`${extendUrl}`, seasonRoutes)
app.use(`${extendUrl}`, fasilitasTambahanRoutes)
app.use(`${extendUrl}`, tarifRoutes)
app.use(`${extendUrl}`, authRoutes)
app.use(`${extendUrl}`, userRoutes)
app.use(`${extendUrl}`, customerGroupRoutes)
app.use(`${extendUrl}`, transaksiRoutes)

app.listen(PORT, (err) => {
  if(err) {
    console.log(`Server Error: ${err}`)
  }
  console.log('====================================')
  console.log(`Server Running on PORT: ${PORT}`)
  console.log('====================================')
})
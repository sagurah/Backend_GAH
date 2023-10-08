const express = require('express')
const cors = require('cors')
require('dotenv').config()

const apiRoutes = require('./routes/index')

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', apiRoutes)

app.listen(PORT, (err) => {
  if(err) {
    console.log(`Server Error: ${err}`)
  }
  console.log(`Server running on port ${PORT}`)
})
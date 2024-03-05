const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./database/connectDB')
const morgan = require('morgan')
const tasksRouter = require('./routes/tasks')
const swaggerUI = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 4000

connectDB()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planning API',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: 'http://localhost:4000'
      },
    ],
  },
  apis: [ './routes/*.js' ],
}

const specs = swaggerJSDoc(options)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/tasks', tasksRouter)

mongoose.connection.once('open', () => {
  console.log('MongoDB connected')
  app.listen(PORT, () => {
    console.log('Server running on port', PORT)
  })
})

module.exports = app

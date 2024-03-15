const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./database/connectDB')
const morgan = require('morgan')
const tasksRouter = require('./routes/tasks')
const authRouter = require('./routes/auth')
const todosRouter = require('./routes/todos')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger/swagger.yaml')

dotenv.config()
const app = express()
const PORT = process.env.PORT ?? 4000

connectDB()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use('/', authRouter)
app.use('/tasks', tasksRouter)
app.use('/todos', todosRouter)

mongoose.connection.once('open', () => {
  console.log('MongoDB connected')
  app.listen(PORT, () => {
    console.log('Server running on port', PORT)
  })
})

module.exports = app

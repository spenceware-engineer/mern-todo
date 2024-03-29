const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Todo',
  }
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Task', taskSchema)

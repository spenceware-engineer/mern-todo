const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
  } catch (e) {
    console.error(e)
  }
}

module.exports = connectDB

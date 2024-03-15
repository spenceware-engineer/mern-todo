const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../database/User')

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'User not found' })

  const passwordsMatch = await bcrypt.compare(password, user.password)

  if (!passwordsMatch) return res.status(401).json({ message: 'Invalid password' })

  return res.status(200).json({
    id: user._id,
    email: user.email,
    token: generateJWT(user._id),
  })
})

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  const existingUser = User.findOne({ email })
  if (existingUser) return res.status(406).json({ message: 'Email already in use' })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    email,
    password: hashedPassword
  })

  if (user) return res.status(201).json({
    id: user._id,
    email: user.email,
    token: generateJWT(user._id),
  })

  return res.end()
})

module.exports = router

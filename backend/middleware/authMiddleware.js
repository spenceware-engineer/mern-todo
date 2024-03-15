const jwt = require('jsonwebtoken')
const User = require('../database/User')

const protect = async (req, res, next) => {
  let { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer')) return res.status(403).json({ message: 'User not authenticated' })

  const token = authorization.split(' ')[ 1 ]
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return res.status(401).json({message: 'Invalid authentication token'})
  }

  req.user = await User.findById(decoded.id).select('-password')

  next()
}

module.exports = { protect }

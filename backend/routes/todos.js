const express = require('express')
const Todo = require('../database/Todo')
const Task = require('../database/Task')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)

router.get('/', async (req, res) => {
  const user = req.user

  try {
    const todos = await Todo.find({ userId: user._id })
    return res.status(200).json(todos)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  const user = req.user
  const {
    id,
    title,
    description,
  } = req.body

  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  }

  try {
    const todo = id ? (
      await Todo.findByIdAndUpdate(
        id,
        {
          title,
          description,
        },
        options
      )
    ) : (
      await Task.create({
        title,
        description,
        userId: user.id,
      })
    )
    return res.status(200).json(todo)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.put('/:id/complete', async (req, res) => {
  const { id } = req.params

  try {
    const findTodo = await Todo.findById(id)
    if (!findTodo) return res.status(404).json({ message: 'Todo not found' })

    const todo = await Todo.findByIdAndUpdate(
      id,
      { completed: findTodo.completed ? false : true },
      { new: true }
    )

    return res.status(200).json(todo)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Task.deleteMany({ todoId: id })
    await Todo.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Todo successfully deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router

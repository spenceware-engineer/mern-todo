const express = require('express')
const router = express.Router()
const Task = require('../database/Task')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/', async (_, res) => {
  const { todoId } = req.body

  try {
    const tasks = await Task.find({ todoId })
    return res.status(200).json(tasks)
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
    todoId
  } = req.body // Extract 'id' and the rest of the data

  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  }

  try {
    const task = id ? (
      await Task.findOneAndUpdate(
        {
          _id: id,
          todoId,
        },
        {
          title,
          description,
          todoId,
        },
        options
      )
    ) : (
      await Task.create({
        title,
        description,
        todoId,
        userId: user.id,
      })
    )
    return res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.put('/:id/complete', async (req, res) => {
  const { id } = req.params

  try {
    const findTask = await Task.findById(id)
    if (!findTask) return res.status(404).json({ message: 'Task not found' })

    const task = await Task.findByIdAndUpdate(
      id,
      { completed: findTask.completed ? false : true },
      { new: true }
    )

    return res.status(200).json(task)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await Task.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Task successfully deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router

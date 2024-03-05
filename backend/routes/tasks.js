const express = require('express')
const router = express.Router()
const Task = require('../database/Task')

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Task ID
 *         title:
 *           type: string
 *           description: Title of the task
 *         description:
 *           type: string
 *           description: Description of the task
 *         completed:
 *           type: boolean
 *           description: Completion indicator
 *       example:
 *         id: 75e3b4c198131d56e4df4d46
 *         title: Example Task
 *         description: This is just an example task, but tasks are structured like this.
 *         completed: false
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Returns all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', async (_, res) => {
  try {
    const tasks = await Task.find()
    return res.status(200).json(tasks)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Upsert Task (Update task if it exists or create task if it does not)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Successfully updated or created Task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', async (req, res) => {
  const { id, title, description } = req.body // Extract 'id' and the rest of the data

  const filter = id ? { _id: id } : {}
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }

  try {
    const task = id ? (
      await Task.findOneAndUpdate(filter, { title, description }, options)
    ) : (
      await Task.create({ title, description })
    )
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @swagger
 * /tasks/{id}/complete:
 *   put:
 *     summary: Change completion status of task (Mark as complete if incomplete or incomplete if complete)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: Task ID
 *     responses:
 *       200:
 *         description: Task completion status successfully changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:id/complete', async (req, res) => {
  const { id } = req.params
  try {
    let task = await Task.findById(id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    if (task.completed) {
      task = await Task.findByIdAndUpdate(id, { completed: false }, { new: true })
    } else {
      task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true })
    }
    return res.status(200).json(task)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by it's ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: Task ID
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

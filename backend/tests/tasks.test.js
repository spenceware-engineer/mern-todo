const mongoose = require('mongoose')
const request = require('supertest')
const server = require('../server')
const connectDB = require('../database/connectDB')

require('dotenv').config()

beforeEach(async () => {
  await connectDB()
})

afterEach(async () => {
  await mongoose.connection.close()
})

describe('GET /tasks', () => {
  it('should return all tasks', async (done) => {
    await request(server)
      .get('/tasks')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        if (res.body.length) {
          expect(res.body[ 0 ]).toHaveProperty('_id')
          expect(res.body[ 0 ]).toHaveProperty('title')
          expect(res.body[ 0 ]).toHaveProperty('description')
          expect(res.body[ 0 ]).toHaveProperty('completed')
        }
      })
    done()
  })
})

describe('POST /tasks', () => {
  it('Should return create and return task', async (done) => {
    await request(server)
      .post('/tasks')
      .send({
        title: 'Example task for jest test',
        description: 'This is a test task created by a Jest test.'
      })
      .set('Content-Type', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('title', 'Example task for jest test')
        expect(res.body).toHaveProperty('description', 'This is a test task created by a Jest test.')
        expect(res.body).toHaveProperty('completed', false)
      })
    done()
  })

  it('Should update and return task', async (done) => {
    await request(server)
      .post('/tasks')
      .send({
        id: '65e3b2a1aed0bffecfa76be4',
        title: 'Updated title for test',
        description: 'Updated test task description!'
      })
      .set('Content-Type', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('_id', '65e3b2a1aed0bffecfa76be4')
        expect(res.body).toHaveProperty('title', 'Updated title for test')
        expect(res.body).toHaveProperty('description', 'Updated test task description!')
        expect(res.body).toHaveProperty('completed')
      })
    done()
  })
})

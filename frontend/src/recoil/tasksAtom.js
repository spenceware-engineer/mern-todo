import { atom } from 'recoil'

const tasksState = atom({
  key: 'tasks',
  default: []
})

export default tasksState

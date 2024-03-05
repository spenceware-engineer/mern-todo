import { atom } from 'recoil'

const currentTaskState = atom({
  key: 'currentTask',
  default: {
    id: '',
    title: '',
    description: '',
  }
})

export default currentTaskState

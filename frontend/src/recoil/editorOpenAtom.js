import { atom } from 'recoil'

const editorOpenState = atom({
  key: 'editorOpen',
  default: false,
})

export default editorOpenState

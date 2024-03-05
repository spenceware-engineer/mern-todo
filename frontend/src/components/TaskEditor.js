import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import editorOpenState from '../recoil/editorOpenAtom'
import currentTaskState from '../recoil/currentTaskAtom'
import tasksState from '../recoil/tasksAtom'
import axios from 'axios'

const TaskEditor = () => {
  const editorOpen = useRecoilValue(editorOpenState)
  const currentTask = useRecoilValue(currentTaskState)
  const setEditorOpen = useSetRecoilState(editorOpenState)
  const setCurrentTask = useSetRecoilState(currentTaskState)
  const setTasks = useSetRecoilState(tasksState)
  const [ title, setTitle ] = useState(currentTask.title)
  const [ description, setDescription ] = useState(currentTask.description)

  useEffect(() => {
    setTitle(currentTask.title)
    setDescription(currentTask.description)
  }, [ currentTask ])

  const cancelTask = () => {
    setTitle('')
    setDescription('')
    setCurrentTask({
      id: '',
      title: '',
      description: '',
    })
    setEditorOpen(false)
  }

  const submitTask = async () => {
    await axios.post(`http://localhost:4000/tasks`, {
      id: currentTask.id ? currentTask.id : null,
      title,
      description
    }).then((res) => {
      setTasks(tasks => {
        if (currentTask.id) {
          return tasks.map(
            task => currentTask.id === task._id ? res.data : task
          )
        } else {
          return [ ...tasks, res.data ]
        }
      })
    })
  }

  return (
    <Dialog
      open={editorOpen}
      onClose={cancelTask}
      fullWidth
    >
      <DialogTitle>{`${currentTask.id ? 'Edit' : 'New'} Task`}</DialogTitle>
      <DialogContent>
        <Grid container sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              onChange={e => setTitle(e.target.value)}
              value={title}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              onChange={e => setDescription(e.target.value)}
              value={description}
              multiline
              rows={5}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelTask}>Cancel</Button>
        <Button onClick={submitTask}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskEditor

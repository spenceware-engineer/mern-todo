import { useEffect } from 'react'
import {
  IconButton,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import axios from 'axios'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import tasksState from '../recoil/tasksAtom'
import currentTaskState from '../recoil/currentTaskAtom'
import editorOpenState from '../recoil/editorOpenAtom'

const Task = ({ taskId, title, description, completed }) => {
  const setTasks = useSetRecoilState(tasksState)
  const setCurrentTask = useSetRecoilState(currentTaskState)
  const setEditorOpen = useSetRecoilState(editorOpenState)
  const currentTask = useRecoilValue(currentTaskState)

  useEffect(() => {
    console.log(currentTask)
  }, [ currentTask ])

  const deleteTask = async () => {
    axios.delete(`http://localhost:4000/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks => tasks.filter(task => task._id !== taskId))
      })
  }

  const changeCompleted = async () => {
    axios.put(`http://localhost:4000/tasks/${taskId}/complete`)
      .then((res) => {
        setTasks(tasks => (
          tasks.map(task => (taskId === task._id) ? res.data : task)
        ))
      })
  }

  const editTask = () => {
    setCurrentTask({ id: taskId, title, description })
    setEditorOpen(true)
  }

  return (
    <div className="task_container">
      <div className="task_container_start">
        <IconButton onClick={changeCompleted}>
          {completed ? (
            <CheckCircleIcon sx={{ fontSize: 42 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 42 }} />
          )}
        </IconButton>
        <div className="task_content">
          <Typography
            variant="h5"
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            className="task_description"
          >
            {description}
          </Typography>
        </div>
      </div>
      <div>
        <IconButton className="task_action_button" onClick={editTask}>
          <EditIcon sx={{ fontSize: 42 }} />
        </IconButton>
        <IconButton className="task_action_button" onClick={deleteTask}>
          <DeleteForeverIcon sx={{ fontSize: 42 }} />
        </IconButton>
      </div>
    </div>
  )
}

export default Task

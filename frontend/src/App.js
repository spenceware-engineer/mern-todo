import { useEffect } from 'react'
import {
  Container,
  IconButton,
  Typography,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Task from './components/Task'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import axios from 'axios'
import tasksState from './recoil/tasksAtom'
import TaskEditor from './components/TaskEditor'
import editorOpenState from './recoil/editorOpenAtom'

function App() {
  const setTasks = useSetRecoilState(tasksState)
  const setEditorOpen = useSetRecoilState(editorOpenState)
  const tasks = useRecoilValue(tasksState)

  useEffect(() => {
    axios.get(`http://localhost:4000/tasks`)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          setTasks(res.data)
        }
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Container className="todo_container">
        <Typography
          variant="h1"
          align="center"
          className="todo_title"
        >
          TODO
        </Typography>
        {tasks && tasks.length ? tasks.map((task) => (
          <Task
            key={task._id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            taskId={task._id}
          />
        )) : (
          <>No tasks here</>
        )}
        <div className="todo_add">
          <IconButton onClick={() => setEditorOpen(true)}>
            <AddCircleIcon sx={{ fontSize: 86 }} />
          </IconButton>
        </div>
      </Container>
      <TaskEditor />
    </>
  )
}

export default App

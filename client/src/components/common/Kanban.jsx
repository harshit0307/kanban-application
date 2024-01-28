import { Box, Button, Card, Divider, IconButton, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'
import TaskModal from './TaskModal'

let timer
const timeout = 500

const Kanban = props => {

    const boardID = props.boardID
    const [data, setData] = useState([])
    const [selectedTask, setSelectedTask] = useState(undefined)

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const onDragEnd = async ({ source, destination}) => {
        if(!destination) return
        const sourceColIndex = data.findIndex(e => e._id === source.droppableId)
        const destinationColIndex = data.findIndex(e => e._id === destination.droppableId)
        const sourceCol = data[sourceColIndex]
        const destinationCol = data[destinationColIndex]

        const sourceSetionID = sourceCol._id
        const destinationSectionID = destinationCol._id

        const sourceTasks = [...sourceCol.tasks]
        const destinationTasks = [...destinationCol.tasks]

        if(source.droppableId !== destination.droppableId){
            const [removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            data[sourceColIndex].tasks = sourceTasks
            data[destinationColIndex].tasks = destinationTasks
        }else{
            const [removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)
            data[destinationColIndex].tasks = destinationTasks
        }

        try{
            await taskApi.updatePosition(boardID, {
                resourceList: sourceTasks,
                destinationList: destinationTasks,
                resourceSectionID: sourceSetionID,
                destinationSectionID: destinationSectionID
            })
            setData(data)

        }catch(err){
            alert(err)
        }
    }

    const createSection = async () => {
        try{
            const section = await sectionApi.create(boardID)
            setData([...data, section])
        }catch(err){
            alert(err)
        }
    }

    const deleteSection = async (sectionId) => {
        try{
            await sectionApi.delete(boardID, sectionId)
            const newData = [...data].filter(e => e._id !== sectionId)
            setData(newData)
        }catch(err){
            alert(err)
        }
    }

    const updateSectionTitle = async (e, sectionId) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        const newData = [...data]
        const index = newData.findIndex(e => e._id === sectionId)
        newData[index].title = newTitle
        setData(newData)
        timer = setTimeout(async () => {
            try{
                await sectionApi.update(boardID, sectionId, { title: newTitle })
                
            } catch(err) {
                alert(err)
            }
        }, timeout)
    }

    const createTask = async (sectionId) => {
        try{
            const task = await taskApi.create(boardID, { sectionId })
            const newData = [...data]
            const index = newData.findIndex(e => e._id === sectionId)
            console.log(index)
            console.log(newData)
            if(newData[index].tasks !== undefined){
                newData[index].tasks.unshift(task)
            }
            else{
                newData[index].task.unshift(task)
            }
            setData(newData)
        }catch(err){
            alert(err)
        }
    }

    const onUpdateTask = (task) => {
        const newData = [...data]
        const sectionIndex = newData.findIndex(e => e._id === task.section._id)
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
        newData[sectionIndex].tasks[taskIndex] = task
        setData(newData)
    }

    const onDeleteTask = (task) => {
        const newData = [...data]
        const sectionIndex = newData.findIndex(e => e._id === task.section._id)
        const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
        newData[sectionIndex].tasks.splice(taskIndex, 1)
        setData(newData)
    }

    const checkTask = (task) => {
        if(task !== undefined) return true
        else return false
    }

  return (
    <>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Button onClick={createSection}>
                Add Section
            </Button>
            <Typography variant='body2' fontWeight='700'>
                {data.length} Sections
            </Typography>
        </Box>
        <Divider sx={{ margin: '10px 0' }} />
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                width: 'calc(100vw - 400px)',
                overflowX: 'auto'
            }}>
                {
                    data.map(section => (
                        <div key={section._id} style={{ width: '300px'}}>
                            <Droppable key={section._id} droppableId={section._id}>
                                {(provided) => (
                                    <Box
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}
                                     sx={{ width: '300px', padding: '10px', marginRight: '10px'}}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px'
                                        }}>
                                            <TextField value={section.title}
                                                onChange={(e) => updateSectionTitle(e, section._id)}
                                                placeholder='Untitled'
                                                variant='outlined'
                                                sx={{
                                                    flexGrow: 1,
                                                    '& .MuiOutlinedInput-input': {padding: 0},
                                                    '& .MuiOutlinedInput-notchedOutline': { border: 'unset'},
                                                    '& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' }
                                                }}
                                            />
                                            <IconButton
                                                variant='outlined'
                                                size='small'
                                                sx={{ color: 'gray', '&:hover': { color: 'green' } }}
                                                onClick={() => createTask(section._id)}
                                            >
                                                <AddOutlinedIcon />
                                            </IconButton>
                                            <IconButton
                                                variant='outlined'
                                                size='small'
                                                sx={{ color: 'gray', '&:hover': { color: 'red' } }}
                                                onClick={() => deleteSection(section._id)}
                                            >
                                                <DeleteOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                        {/* tasks */}
                                        {
                                        checkTask(section.tasks) ? (
                                            section.tasks.map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Card
                                                         ref={provided.innerRef}
                                                         {...provided.draggableProps}
                                                         {...provided.dragHandleProps}
                                                         sx={{
                                                            padding: '10px',
                                                            marginBottom: '10px',
                                                            cursor: snapshot.isDragging ? "grab" : 'pointer!important'
                                                         }}
                                                         onClick={() => setSelectedTask(task)}
                                                        >
                                                            <Typography>
                                                                {task.title === '' ? 'Untitled' : task.title}
                                                            </Typography>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))
                                         ) : (
                                                // console.log(section.tasks)
                                                section.task.map((task, index) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <Card
                                                             ref={provided.innerRef}
                                                             {...provided.draggableProps}
                                                             {...provided.dragHandleProps}
                                                             sx={{
                                                                padding: '10px',
                                                                marginBottom: '10px',
                                                                cursor: snapshot.isDragging ? "grab" : 'pointer!important'
                                                             }}
                                                             onClick={() => setSelectedTask(task)}
                                                            >
                                                                <Typography>
                                                                    {task.title === '' ? 'Untitled' : task.title}
                                                                </Typography>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )
                                        }
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </div>
                    ))
                }
            </Box>
        </DragDropContext>
        <TaskModal task={selectedTask} boardID={boardID} onClose={() => setSelectedTask(undefined)} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
    </>
  )
}

export default Kanban
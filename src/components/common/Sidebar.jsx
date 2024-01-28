import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import assets from '../../assets/index'
import { Link, useNavigate, useParams } from 'react-router-dom'
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import FavouriteList from './FavouriteList'

const Sidebar = () => {

  const user = useSelector((state) => state.user.value)
  const boards = useSelector((state) => state.board.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardID } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const sidebarWidth = 250

  useEffect(() => {
    const getBoards = async () => {
      try{
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const activeItem = boards.findIndex(e => e._id === boardID)
    if (boards.length > 0 && boardID === undefined){
      navigate(`/boards/${boards[0]._id}`)
    }
    setActiveIndex(activeItem)
  }, [boards, boardID, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e._id === boardID)
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try{
      await boardApi.updatePosition({ boards: newList })
    }catch(err) {
      alert(err)
    }
  }

  const addBoard = async () => {
    try{
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res._id}`)
    } catch(err) {
      alert(err)
    }
  }

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{width: sidebarWidth, height: '100vh', '& > div': { borderRight: 'none' }}}
    >
      <List
        disablePadding
        sx={{width: sidebarWidth, height: '100vh', backgroundColor: assets.colors.secondary}}
      >
        <ListItem>
          <Box
            sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
          >
            <Typography variant='body2' fontWeight='700'>
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>
        
        <Box sx={{ padding: '10px' }} />

        <FavouriteList />
        
        <Box sx={{ padding: '10px' }} />

        <ListItem>
          <Box
            sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
          >
            <Typography variant='body2' fontWeight='700'>
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
        </ListItem>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {
                  boards.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <ListItemButton
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          selected={index === activeIndex}
                          component={Link}
                          to={`/boards/${item._id}`}
                          sx={{p1: '20px', cursor: snapshot.isDragging ? 'grab' : 'pointer!important'}}
                        >
                          <Typography
                            variant='body2'
                            fontWeight='700'
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                          >
                            {item.icon} {item.title}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
      </List>
    </Drawer>
  )
}

export default Sidebar
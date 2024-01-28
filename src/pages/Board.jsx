import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import { Box, IconButton, TextField } from '@mui/material'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EmojiPicker from '../components/common/EmojiPicker'
import { useDispatch, useSelector } from 'react-redux'
import { setBoards } from '../redux/features/boardSlice'
import { setFavouriteList } from '../redux/features/favouriteSlice'
import Kanban from '../components/common/Kanban'

let timer
const timeout = 500

const Board = () => {
  const { boardID } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourites.value) 

  useEffect(() => {
    const getBoard = async () =>{
      try{
        const res = await boardApi.getOne(boardID)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourites)
        setIcon(res.icon)
        console.log(res)
      } catch(err){
        alert(err)
        console.log(err)
      }
    }
    getBoard()
  }, [boardID])

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e._id === boardID)
    temp[index] = {...temp[index], icon: newIcon}

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e._id === boardID)
      tempFavourite[favouriteIndex] = {...tempFavourite[favouriteIndex], icon: newIcon}
      dispatch(setFavouriteList(tempFavourite))
    }

    setIcon(newIcon)
    dispatch(setBoards(temp))
    try{
      await boardApi.update(boardID, { icon: newIcon })
    }catch(err){
      alert(err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e._id === boardID)
    temp[index] = {...temp[index], title: newTitle}

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e._id === boardID)
      tempFavourite[favouriteIndex] = {...tempFavourite[favouriteIndex], title: newTitle}
      dispatch(setFavouriteList(tempFavourite))
    }

    dispatch(setBoards(temp))
    timer = setTimeout(async () => {
      try{
        await boardApi.update(boardID, { title: newTitle })
      }catch(err){
        alert(err)
      }
    }, timeout);
  }

  const updateDescription = (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)

    timer = setTimeout(async () => {
      try{
        await boardApi.update(boardID, { description: newDescription })
      }catch(err){
        alert(err)
      }
    }, timeout);
  }

  const addFavourite = async () => {
    try{
      const board = await boardApi.update(boardID, { favourites: !isFavourite })
      let newFavouriteList = [...favouriteList]
      if (isFavourite){
        newFavouriteList = newFavouriteList.filter(e => e._id !== boardID)
      }else{
        newFavouriteList.unshift(board)
      }
      dispatch(setFavouriteList(newFavouriteList))
      setIsFavourite(!isFavourite)
    }catch(err) {
      alert(err)
    }
  }

  const deleteBoard = async () => {
    try{
      await boardApi.delete(boardID)
      if (isFavourite){
        const newFavouriteList = favouriteList.filter(e => e._id !== boardID)
        dispatch(setFavouriteList(newFavouriteList))
      }
      const newList = boards.filter(e => e._id !== boardID)
      if(newList.length === 0){
        navigate('/boards')
      }else{
        navigate(`/boards/${newList[0]._id}`)
      }
      dispatch(setBoards(newList))
    }catch(err){
      alert(err)
    }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField 
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField 
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
          <Kanban data={sections} boardID={boardID} />
          {/* Kanban board */}
        </Box>
      </Box>
    </>
  )
}

export default Board
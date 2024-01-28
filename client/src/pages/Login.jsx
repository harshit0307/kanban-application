import { Box, Button, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"


const Login = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUserNameErrText] = useState("")
  const [passwordErrText, setPasswordErrText] = useState("")
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUserNameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if(username === '') {
      err = true
      setUserNameErrText('Please Fill this field')
    }
    if(password === '') {
      err = true
      setPasswordErrText('Please Fill this field')
    }

    if(err) return

    setLoading(true)

    try{
      const res = await authApi.login({username, password})
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    }catch(err){
      console.log(err.data.errors)
      const errors = err.data.errors
      
      errors.forEach(e => {
        if (e.param === 'username'){
          setUserNameErrText(e.msg)
        }
        if (e.param === 'password'){
          setPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }
  return (
    <>
      <Box 
      component='form'
      sx={{ mt: 1}}
      onSubmit={handleSubmit}
      noValidate>
        <TextField 
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username" 
        name="username"
        disabled={loading}
        error={usernameErrText !== ""}
        helperText={usernameErrText}
        />
        <TextField 
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password" 
        name="password"
        type="password"
        disabled={loading}
        error={passwordErrText !== ""}
        helperText={passwordErrText}
        />
        <LoadingButton
        sx={{ mt: 3, mb: 2 }}
        variant="outlined"
        fullWidth
        color="success"
        type="submit"
        loading={loading}>
          Login
        </LoadingButton>
      </Box>
      <div>
        Don't have an account?
        <Button
        component={Link}
        to='/signup'
        sx={{ textTransform: 'none'}}>
          <u>Signup</u>
        </Button>
      </div>
    </>
  )
}

export default Login
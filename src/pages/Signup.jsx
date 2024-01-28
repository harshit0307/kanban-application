import { Box, Button, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authApi from "../api/authApi"

const Signup = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUserNameErrText] = useState("")
  const [passwordErrText, setPasswordErrText] = useState("")
  const [confirmpassErrText, setConfirmPassErrText] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()
    setUserNameErrText('')
    setConfirmPassErrText('')
    setPasswordErrText('')
  
    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmpassword = data.get('confirmpassword').trim()

    let err = false

    if(username === '') {
      err = true
      setUserNameErrText('Please Fill this field')
    }
    if(password === '') {
      err = true
      setPasswordErrText('Please Fill this field')
    }
    if(confirmpassword === '') {
      err = true
      setConfirmPassErrText('Please Fill this field')
    }
    if(confirmpassword !== password) {
      err = true
      setConfirmPassErrText('Confirm Password not match')
    }
    if(err) return

    setLoading(true)
    
    try{
      const res = await authApi.signup({
        username, password, confirmpassword
      })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    }catch(err){
      console.log(err.data.errors)
      const errors = err.data.errors
      
      errors.forEach(e => {
        if (e.path === 'username'){
          setUserNameErrText(e.msg)
        }
        if (e.path === 'password'){
          setPasswordErrText(e.msg)
        }
        if (e.path === 'confirmpassword'){
          setConfirmPassErrText(e.msg)
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
        error={passwordErrText !== ''}
        helperText={passwordErrText}
        />
        <TextField 
        margin="normal"
        required
        fullWidth
        id="confirmpassword"
        label="Confirm Password" 
        name="confirmpassword"
        type="password"
        disabled={loading}
        error={confirmpassErrText !== ''}
        helperText={confirmpassErrText}
        />
        <LoadingButton
        sx={{ mt: 3, mb: 2 }}
        variant="outlined"
        fullWidth
        color="success"
        type="submit"
        loading={loading}>
          Signup
        </LoadingButton>
      </Box>
      <div>
        Already have an account?
        <Button
        component={Link}
        to='/login'
        sx={{ textTransform: 'none'}}>
          <u>Login</u>
        </Button>
      </div>
    </>
  )
}

export default Signup
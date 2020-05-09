import React from 'react';
import './login.styles.scss';
const candy = require('../../assets/candy.png')
const mess = require('../../assets/mess.png')
const ingloyd = require('../../assets/Ingloyd.png')

const Login = ({getSignedInUser}) => {

  const handleSignIn = (username) => {
    getSignedInUser(username)
  }
  
  return (
    <div className='login-container'>
      <div className='header'>
        <h1>A Very Hainsey Quiz...</h1>
        <h2>Choose your avatar!</h2>
      </div>
      <div className='avatar-section'>
        
        <div className='profile'>
          <img src={ingloyd} alt="profile"/>
          <button onClick={() => {handleSignIn('Ingloyd')}}>Ingloyd</button>
        </div>
        <div className='profile'>
          <img src={mess} alt="profile"/>
          <button onClick={() => {handleSignIn('Mess')}}>Mess</button>
        </div>
        <div className='profile'>
          <img src={candy} alt="profile"/>
          <button onClick={() => {handleSignIn('Candy')}}>Candy</button>
        </div>
        

      </div>
   

    </div>

  ) 
}

export default Login;
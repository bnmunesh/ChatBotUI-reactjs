import React, {useState} from 'react'
import "./Loginexecutive.css"

const Loginexecutive = () => {

    const [popupStyle,showPopup]=useState("hide");
    const [rememberMe, setRememberMe] = useState(false);

    const popup =() =>{
        showPopup("Login-popup")
        setTimeout(()=> showPopup("hide"), 3000)
    }

    const onSuccess = e => {
        alert("User signed in")
        console.log(e)
    }

  return (
    <div className='login-container'>
        <div className='cover'>
            <h1 className='customFont'>Executive Login</h1>
            <div className='credentials'>
                <input className='customFont' type="text" placeholder='username'/>
                <input className='customFont' type="password" placeholder='password'/>
            </div>
            <label className='customFont labelcheckbox' >
                    <input className='checkboxlogin'  type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                    Remember Me
            </label>

            <div className='login-button customFont' onClick={popup}>Login</div>

            <div className={popupStyle}>
                <h3 className='customFont'>Login Unsuccessful</h3>
                <p className='customFont'>Username or Password incorrect</p>
            </div>
        </div>
    </div>
  )
}

export default Loginexecutive
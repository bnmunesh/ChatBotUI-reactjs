import React, {useState} from 'react'
import "./Loginexecutive.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loginexecutive = () => {

    const [popupStyle,showPopup]=useState("hide");
    const [rememberMe, setRememberMe] = useState(false);

    const[userName,setUserName]=useState("");
    const[userPass,setUserPass]=useState("");
    const naviagte=useNavigate()
 


    const popup =(e) =>{
        e.preventDefault()

        axios.post("http://localhost:3000/executive/login", {executiveID:userName, password:userPass}).then((res)=> {
            if(res.data.success)
            {
                onSuccess(e)
                localStorage.setItem("executiveID",res.data.data.executiveID)
                naviagte("/executive")

            }

            else{
                showPopup("Login-popup")
                setTimeout(()=> showPopup("hide"), 3000)
            }
        }).catch((er)=> { 
            showPopup("Login-popup")
            setTimeout(()=> showPopup("hide"), 3000)})
        
    }

    const onSuccess = e => {
        alert("User signed in")
        console.log(e)
    }

  return (
    <div className='login-container'>
        <div className='cover'>
            <h1 className='customFont'>Admin | Executive</h1>
            {/* <h1 className='customFont'><span className='customFont'>Admin</span> | <span className='customFont'>Executive</span></h1> */}

            <div className='credentials'>
                <input type="text" placeholder='Username' value={userName} onChange={(e)=> setUserName(e.target.value)}/>
                <input type="password" placeholder='Password' value={userPass} onChange={(e)=> setUserPass(e.target.value)} />
            </div>
            <label className='customFont labelcheckbox' >
                    <input className='checkboxlogin'  type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                    Remember Me
            </label>

            <div className='login-button customFont' onClick={popup}>Log in</div>

            <div className={popupStyle}>
                <h3 className='customFont'>Login Unsuccessful</h3>
                <p className='customFont'>Username or Password incorrect</p>
            </div>
        </div>
    </div>
  )
}

export default Loginexecutive
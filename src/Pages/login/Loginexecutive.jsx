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
        let URL = "http://localhost:3000/executive/login"
        let payload = {executiveID:userName, password:userPass}
        if(userName.includes("admin")) {
            payload = {...payload, adminID: userName}
            URL = "http://localhost:3000/admin/login"
        }
            axios.post(URL, payload).then((res)=> {
            if(res.data.success)
            {
                onSuccess(e)
                if(userName.includes("admin")){
                    localStorage.setItem("adminID",res.data.data.adminID)
                    naviagte("/admin")

                }else{
                    localStorage.setItem("executiveID",res.data.data.executiveID)
                    naviagte("/executive")
                }

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            popup(e);
        }
    };

  return (
    <div className='login-container'>
        <div className='cover'>
            <h1 className='customFont'>Admin | Executive</h1>
            {/* <h1 className='customFont'><span className='customFont'>Admin</span> | <span className='customFont'>Executive</span></h1> */}

            <div className='credentials'>
                <input type="text" placeholder='Username' value={userName} onChange={(e)=> setUserName(e.target.value)}/>
                <input type="password" placeholder='Password' value={userPass} onChange={(e)=> setUserPass(e.target.value)} onKeyDown={handleKeyDown}/>
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
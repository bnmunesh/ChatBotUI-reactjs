import Chatbot from './Pages/User/chatbot.jsx'

import {BrowserRouter, Routes, Route} from "react-router-dom"
import io from "socket.io-client";
export const socket = io("ws://localhost:3000")
import { useEffect } from 'react';
import CustomerSupportChat from './Pages/Executive/CustomerSupportChat.jsx';
import CustomerSupportForm from './Pages/FormPage/CustomerSupportForm.jsx';

function App() {

  useEffect(()=>{
    socket.emit("create-conversation");
  }, [])
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='User' element={<Chatbot socket={socket}/>} />
      <Route path='Executive' element={<CustomerSupportChat socket={socket}/>} />
      <Route path='Form' element={<CustomerSupportForm socket={socket}/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

import Chatbot from './components/chatbot.jsx'
import io from "socket.io-client";
export const socket = io("ws://localhost:3000")
import { useEffect } from 'react';

function App() {

  useEffect(()=>{
    socket.emit("create-conversation");
  }, [])
  socket.on('convo-creted', (convoID)=>{
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
    localStorage.setItem("convoID", convoID)
    localStorage.setItem("threadID", null)
  })

  return (
    <Chatbot socket={socket}/>
  )
}

export default App

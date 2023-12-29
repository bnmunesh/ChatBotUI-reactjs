import React, {
    useState,
    useRef,
    useEffect,
    ChangeEvent,
    KeyboardEvent,
  } from "react";
  import "./chatbot.css";
  const Chatbot = ({socket}) => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [handler, setHandler] = useState("bot");
    const [convoIDOfficial, setConvoIDOfficial] = useState(null)

    const chatboxRef = useRef(null);
    const chatInputRef = useRef(null);
  
    useEffect(() => {
      if (showChatbot && chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }, [chatHistory, showChatbot]);
  
    const toggleChatbot = () => {
      setShowChatbot((prevShowChatbot) => !prevShowChatbot);
    };
    // const generateResponse = async (): Promise<{ message: string }> => {
    //   const response = await new Promise<{ message: string }>((resolve) => {
    //     setTimeout(() => {
    //       resolve({ message: "Response from the chatbot!" });
    //       //show ai msg here
    //     }, 1000);
    //   });
  
    //   return response;
    // };
  

    useEffect(()=>{
      socket.on('convo-creted', (convoID)=>{
        if(!convoIDOfficial){
          localStorage.setItem("convoID", convoID)
          localStorage.setItem("threadID", null)
          setConvoIDOfficial(convoID)
        }
      })
      socket.on("query-response", (data)=>{
        console.log("data",data)
        localStorage.setItem("threadID", data.threadID)
        //removes loading.. and shows latest ai msg
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory, 
          { sender: "bot", message: data.text },
        ]);
      })
      socket.on("executive-response", data=>{
        setChatHistory((prevChatHistory)=>[...prevChatHistory, {sender:"executive", message: data.text}])
      })
    }, [])


    useEffect(() => {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }, [chatHistory]);
  
    const handleChat = async () => {
      if (!userMessage.trim()) return;
      console.log("++++++++++++++========================+++++++++++++++++++")
      if(chatHistory.length === 0) socket.emit("create-convo-and-add-message", {message:userMessage, handler});
      else{
        const threadID = localStorage.getItem("threadID");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++=")
        socket.emit("message", {message:userMessage, threadID: threadID ? threadID :null, convoID:convoIDOfficial, handler, sentBy: "user"})
      }
        
        setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "user", message: userMessage },
      ]);
      
      
      
      setUserMessage("");
      //loadingg......
      // setChatHistory((prevChatHistory) => [
      //   ...prevChatHistory,
      //   { sender: "bot", message: "Loading..." },
      // ]);
  
      // const { message } = await generateResponse();
  
      // //removes loading.. and shows latest ai msg
      // setChatHistory((prevChatHistory) => [
      //   ...prevChatHistory.slice(0, -1), 
      //   { sender: "bot", message },
      // ]);
    
  
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    };


  
    const handleInputChange = (e) => {
      setUserMessage(e.target.value);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
      }
    };

    const HanldeSwtichToExecutive = () =>{
      setHandler("executive");
      const convoID = localStorage.getItem("convoID");
      socket.emit("switch-to-executive", convoID)
    }
  
    return (
      <section className="show-chatbot" style={{backgroundColor: "#fffff"}}>
          <div className="xyz">
            {showChatbot? (
              <div className="switch-text" style={{color:"black"}}>
                <p >Not satisfied with the bot? <span onClick={HanldeSwtichToExecutive} style={{textDecoration:"underline", cursor:"pointer"}}>click here to switch to an actual executive</span></p>
              </div>
            ): (
              <div className="switch-text">
                <p>hihihih</p>
              </div>
            )}
            <button className="chatbot_toggler" onClick={toggleChatbot}>
              {showChatbot ? (
                <span className="material-symbols-outlined">close</span>
                ) : (
                  <span className="material-symbols-outlined">mode_comment</span>
                  )}
            </button>
          </div>
        {showChatbot && (
          <div className="chatbot">
            <header>
              <h2>ChatBot</h2>
              <span className="material-symbols-outlined">close</span>
            </header>
            <ul className="chatbox" ref={chatboxRef}>
              <li className="chat incoming">
                <span className="material-symbols-outlined">smart_toy</span>
                <p>Hello! How can I assist you today?</p>
              </li>
              {chatHistory.map((chat, index) => (
                <li
                  key={index}
                  className={`chat ${
                    chat.sender === "bot" || chat.sender === "executive" ? "incoming" : "outgoing"
                  }`}
                >
                  {(chat.sender === "bot" || chat.sender === "executive") && (
                    <span className="material-symbols-outlined">smart_toy</span>
                  )}
                  <p>{chat.message}</p>
                </li>
              ))}
            </ul>
            <div className="chat_input">
              <textarea
                placeholder="Enter a message..."
                spellCheck="false"
                required
                value={userMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={chatInputRef}
              />
              <span
                id="send-btn"
                className="material-symbols-rounded"
                onClick={handleChat}
              >
               <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>send</title><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
              </span>
            </div>
          </div>
        )}
      </section>
    );
  };
  
  export default Chatbot;
  
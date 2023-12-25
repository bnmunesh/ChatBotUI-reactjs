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
      socket.on("query-response", (data)=>{
        console.log("data",data)
        localStorage.setItem("threadID", data.threadID)
        //removes loading.. and shows latest ai msg
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory, 
          { sender: "bot", message: data.text },
        ]);
      })
    }, [])


    useEffect(() => {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }, [chatHistory]);
  
    const handleChat = async () => {
      
      if (!userMessage.trim()) return;
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "user", message: userMessage },
      ]);
  
      setUserMessage("");

      const convoID = localStorage.getItem("convoID");
      const threadID = localStorage.getItem("threadID");
      socket.emit("message", {message:userMessage, threadID: threadID ? threadID :null, convoID})
  
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
  
    return (
      <section className="show-chatbot">
        <button className="chatbot_toggler" onClick={toggleChatbot}>
          {showChatbot ? (
            <span className="material-symbols-outlined">close</span>
          ) : (
            <span className="material-symbols-outlined">mode_comment</span>
          )}
        </button>
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
                    chat.sender === "bot" ? "incoming" : "outgoing"
                  }`}
                >
                  {chat.sender === "bot" && (
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
  
// CustomerSupportChat.js
import "../../App.css";
import React, { useEffect, useState } from "react";
import "./customer-support-chat.css";
import { useNavigate } from "react-router-dom";

const CustomerSupportChat = ({socket}) => {
  const [convos, setConvos] = useState([])
  const [OriginalListOfConvos, setOriginalListOfConvos] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    handleStatusFilterChange("setAllByCheckingStatusFilter");
  }, [OriginalListOfConvos])


  useEffect(()=>{
    console.log({selectedConversation})
  }, [selectedConversation])

  useEffect(()=>{
    const loginStatus = localStorage.getItem("executiveID");
    if(loginStatus == null){
      navigate("/login")
    }
    socket.emit('load-chats-for-executive')
    socket.on("convos-for-executive", (chats)=>{
      console.log(chats)
      setOriginalListOfConvos(chats);
    })
    socket.on('new-customer-for-executive', (chat)=>{
      console.log("chats", chat)
      setOriginalListOfConvos(chats=>[chat, ...chats])
    })

  }, [])

  socket.on("user-disconected", (socketID)=>{
    const userDisconnected = OriginalListOfConvos.map(el=>{
      if(el.socketID === socketID) {
        el.status = "closed"
      }
      return el;
    });
    console.log(userDisconnected)
    if(selectedConversation?.socketID === socketID){
      setSelectedConversation(prev=> ({...prev, status: "closed"}))
      alert("user-disconnected")
    }
    setOriginalListOfConvos(userDisconnected);
  })

  socket.on("user-response", chat=>{
    console.log("userResponse", chat)
    // updateConvos(chat)
    let bufChats = convos;
    console.log("buff chats before iteration:", {bufChats, convos})
    for(let i=0; i<bufChats.length; i++){
      if(bufChats[i]._id === chat._id){
        bufChats[i] = chat;
      }
    }
    console.log("bufChats", bufChats)
    setOriginalListOfConvos(bufChats);
    if(selectedConversation && selectedConversation._id === chat._id){
      setSelectedConversation(chat)
    }
  })
    
  // State to keep track of the selected conversation

  // State for search bar
  const [searchTerm, setSearchTerm] = useState("");

  // State for status filters
  const [statusFilters, setStatusFilters] = useState({
    ongoing: false,
    waiting: false,
    closed: false,
  });

  // State for new message input
  const [newMessage, setNewMessage] = useState("");

  // Function to handle conversation selection
  const handleConversationSelect = (conversationId) => {
    const selectedConv = convos.find(
      (conv) => conv._id === conversationId
    );
    console.log("selectedConv", selectedConv, "id", conversationId,convos)
    setSelectedConversation(selectedConv);
  };

  // Function to filter conversations based on search term and status filters
  const filteredConversations = OriginalListOfConvos.filter((conversation) => {
    const hasSearchTerm = conversation._id.toString().includes(searchTerm);
    const isFiltered =
      (statusFilters.ongoing && conversation.status === "ongoing") ||
      (statusFilters.waiting && conversation.status === "waiting") ||
      (statusFilters.closed && conversation.status === "closed");

    return (
      hasSearchTerm &&
      (isFiltered ||
        (!statusFilters.ongoing &&
          !statusFilters.waiting &&
          !statusFilters.closed))
    );
  });

  // Function to handle status filter changes
  const handleStatusFilterChange = (status) => {
      let buffer = [];
      let addedChats = false;
      if(statusFilters.ongoing || status == "ongoing"){
        if(statusFilters.ongoing ^ (status == "ongoing")){
          addedChats = true;
          const bufChats = OriginalListOfConvos.filter((el)=> el.executiveSocketID != null && el.status != "closed");
          buffer = [...bufChats]
        }
      }
      if(statusFilters.waiting || status == "waiting"){
        if(statusFilters.waiting ^ status == 'waiting'){
          addedChats = true;
          const bufChats = OriginalListOfConvos.filter(el=>el.executiveSocketID == null && el.status != "closed");
          buffer = [...buffer, ...bufChats]
        }
      }
      if(statusFilters.closed || status == "closed"){
        if(statusFilters.closed ^ status == "closed"){
          addedChats = true;
          const bufChats = OriginalListOfConvos.filter(el=>el.status === "closed")
          buffer = [...buffer, ...bufChats]
        }
      }
      if(!addedChats && buffer.length === 0) buffer = OriginalListOfConvos;
      setConvos(buffer)
      setStatusFilters((prevFilters) => ({
        ...prevFilters,
        [status]: !prevFilters[status],
      }));
  };

  // Function to handle sending a new message
  const handleSendMessage = () => {
    console.log("sendMessage",{selectedConversation, newMessage})
    if (selectedConversation && newMessage.trim() !== "") {
      let SSL = null;
      const updatedConversations = OriginalListOfConvos.map((conv) =>{
        if (conv._id === selectedConversation._id){
          conv = {
            ...conv,
            executiveSocketID:socket.id,
            messages: [
              ...conv.messages,
              { text: newMessage, sentBy: "executive" },
            ],
          }
          setSelectedConversation(conv);
        }
        return conv;
        });
      socket.emit("message", {message: newMessage, convoID:selectedConversation._id, handler:"executive", sentBy:"executive"})
      // const buf = selectedConversation;
      // buf.messages = [...selectedConversation.messages, {text: newMessage, sentBy: "executive"}]
      // setSelectedConversation(buf)
      console.log({updatedConversations})
      setOriginalListOfConvos(updatedConversations);
      setNewMessage("");
    }
  };

  const handleEndConversation = (e)=>{
    e.preventDefault();
    let arr = convos;
    arr = arr.filter(el=>el._id != selectedConversation._id)
    socket.emit("executive-sets-close-conversation", selectedConversation._id)
    setSelectedConversation(prev => ({
      ...prev,
      status: "closed",
    }))
    // navigate('/form', {state: {conversationID: selectedConversation._id} });
    window.open('http://localhost:5173/form','_blank')
  }

  return (
    <div className="chat-container">
      {/* Left Column */}
      <div className="conversations-container">
        <h2>Conversations</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul className="conversation-list">
          {convos.length > 0 && convos.map((conversation, i) => (
            <div
              key={conversation._id}
              className={`conversation-item ${
                selectedConversation?._id === conversation._id ? "selected" : "notselected"
              }`}
              onClick={() => handleConversationSelect(conversation._id)}
            >
              <div>{`ID: ${conversation._id}`}</div>
              <div>Status: {conversation.status === "closed"? "closed": conversation.executiveSocketID != null ? "ongoing" : "waiting"}</div>
            </div>
          ))}
        </ul>

        {/* Add Box with Check Options for Status Filters */}
        <div className="status-filters">
          <label>
            <input
              type="checkbox"
              checked={statusFilters.ongoing}
              onChange={() => handleStatusFilterChange("ongoing")}
            />
            Ongoing
          </label>
          <label>
            <input
              type="checkbox"
              checked={statusFilters.waiting}
              onChange={() => handleStatusFilterChange("waiting")}
            />
            Waiting
          </label>
          <label>
            <input
              type="checkbox"
              checked={statusFilters.closed}
              onChange={() => handleStatusFilterChange("closed")}
            />
            Closed
          </label>
        </div>
      </div>

      {/* Right Column */}
      <div className="chat-window">
        {selectedConversation ? (
          <>
            <div className="conversation-header">
              <h2 className="chat-header">{`Conversation ID: ${selectedConversation._id} - Status: ${selectedConversation.status === "closed"? "closed": selectedConversation.executiveSocketID != null ? "ongoing" : "waiting"}`}</h2>
              {selectedConversation.status === "closed" ? <></>: <button onClick={handleEndConversation}>End Chat</button>}
            </div>
            <div className="message-container">
              {/* Display messages for the selected conversation */}
              {selectedConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${message.sentBy === "bot" || message.sentBy === "executive" ? "outgoing" : 'incoming'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {/* Type Message Box and Send Button */}
            { selectedConversation.status !== "closed" && <div className="input-box">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            }
          </>
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportChat;
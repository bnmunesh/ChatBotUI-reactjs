// CustomerSupportChat.js
import "../../App.css";
import React, { useEffect, useState } from "react";
import "./customer-support-chat.css";

const CustomerSupportChat = ({socket}) => {
  const [convos, setConvos] = useState([])
  // Sample data for conversations
  const [conversations, setConversations] = useState([
    {
      id: 1,
      status: "ongoing",
      messages: [
        { text: "Hello!", type: "incoming" },
        { text: "I need help", type: "incoming" },
        { text: "How can we assist you today?", type: "outgoing" },
      ],
    },
    { id: 2, status: "waiting", messages: [] },
    { id: 4, status: "closed", messages: [] },
    { id: 5, status: "closed", messages: [] },
    { id: 6, status: "waiting", messages: [] },
    { id: 7, status: "waiting", messages: [] },
    { id: 8, status: "closed", messages: [] },
    { id: 9, status: "closed", messages: [] },
    { id: 10, status: "waiting", messages: [] },
    { id: 11, status: "waiting", messages: [] },
    { id: 12, status: "closed", messages: [] },
    { id: 13, status: "closed", messages: [] },
    { id: 14, status: "closed", messages: [] },
    { id: 15, status: "closed", messages: [] },
    { id: 16, status: "closed", messages: [] },
    { id: 17, status: "closed", messages: [] },
    // ... additional conversations ...
  ]);

  function updateConvos(chat){
    console.log({convos, chat})
    // const bufChats = convos;
    // for(let i=0; i<bufChats.length; i++){
    //   if(bufChats[i]._id === chat._id){
    //     bufChats[i] = chat;
    //   }
    // }
    // console.log("bufChats", bufChats)
    // setConvos(bufChats);
  }

    useEffect(()=>{
      socket.emit('load-chats-for-executive')
      socket.on("convos-for-executive", (chats)=>{
        setConvos(chats)
      })
      socket.on('new-customer-for-executive', (chat)=>{
        console.log("chats", chat)
        setConvos(chats=>[chat, ...chats])
      })
    }, [])
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
      setConvos(bufChats);
      if(selectedConversation && selectedConversation._id === chat._id){
        setSelectedConversation(chat)
      }
    })


    
  // State to keep track of the selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);

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
  const filteredConversations = conversations.filter((conversation) => {
    const hasSearchTerm = conversation.id.toString().includes(searchTerm);
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
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  // Function to handle sending a new message
  const handleSendMessage = () => {
    console.log("sendMessage",{selectedConversation, newMessage, conversations})
    if (selectedConversation && newMessage.trim() !== "") {
      const updatedConversations = convos.map((conv) =>
        conv._id === selectedConversation._id
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { text: newMessage, type: "outgoing" },
              ],
            }
          : conv
      );
      console.log("id:", selectedConversation._id)
      socket.emit("message", {message: newMessage, convoID:selectedConversation._id, handler:"executive", sentBy:"executive"})
      const buf = selectedConversation;
      buf.messages = [...selectedConversation.messages, {text: newMessage, sentBy: "executive"}]
      setSelectedConversation(buf)
      // console.log(updatedConversations)
      setConvos(updatedConversations);
      setNewMessage("");
    }
  };
  const handleEndConversation = (e)=>{
    e.preventDefault();
    
    socket.emit("executive-sets-close-conversation", selectedConversation._id)
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
              {/* <div>Status: {conversation.status}</div> */}
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
              <h2 className="chat-header">{`Conversation ID: ${selectedConversation._id} - Status: ${selectedConversation.status}`}</h2>
              <button onClick={handleEndConversation}>End Chat </button>
            </div>
            <div className="message-container">
              {/* Display messages for the selected conversation */}
              {selectedConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${message.sentBy === "bot" || message.sentBy === "executive" ? "incoming" : 'outgoing'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {/* Type Message Box and Send Button */}
            <div className="input-box">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportChat;
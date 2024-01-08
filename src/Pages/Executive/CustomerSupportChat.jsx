// CustomerSupportChat.js
// import "../../App.css";
import React, { useEffect, useState, useRef} from "react";
import { AppBar,Toolbar,styled,Box,Dialog,InputBase,Divider, Menu, MenuItem} from '@mui/material'
import "./customer-support-chat.css";
import { useNavigate } from "react-router-dom";
import execLogo from '../../assets/man.png'
import morevert from '../../assets/menu.png'
import searchicon from '../../assets/iconsearch.svg'
import defuser from '../../assets/user.png'
import attachicon from '../../assets/attach-file.png'


const Component = styled(Box)`
height: 100vh;
background: #d3ccc;
`

const Header = styled(AppBar)`
height: 125px;
background-color: rgb(0, 22, 123);
box-shadow: none;
`
const Inputfield = styled(InputBase)`
width:100%;
padding: 16px;
height: 15px;
padding-left: 60px;
font-size: 14px;
`
const StyledDivider = styled(Divider)`
margin: 0 0 0 70px;
background-color: #e9edef;
opacity: 0.4;
`
const StyledDivider2 = styled(Divider)`
margin: 2em 15em 0px 15em;
background-color: #e9edef;
opacity: 0.6;
`
const Inputfield2 = styled(InputBase)`
width:100%;
padding: 20px;
height: 20px;
padding-left: 25px;
font-size: 14px;
`

const DialogStyle = {
  height: '96%',
  marginTop: '3%',
  width: '97%',
  borderRadius: '0px',
  maxWidth: '100%',
  maxHeight: '100%',
  boxShadow: 'none',
  overflow: 'none'
}





const CustomerSupportChat = ({socket}) => {
  const [convos, setConvos] = useState([])
  const [OriginalListOfConvos, setOriginalListOfConvos] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  const scrollRef = useRef();

  useEffect(()=> {
    scrollRef.current?.scrollIntoView({transition: 'smooth'})
  })

  useEffect(()=>{
    handleStatusFilterChange("setAllByCheckingStatusFilter");
  }, [OriginalListOfConvos])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
    const hasSearchTerm = conversation._id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    return (
      hasSearchTerm
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
    localStorage.removeItem('executiveID')
    navigate("/login")
  };

  return (
    <Component>
    <Header>
      <Toolbar></Toolbar>
    </Header>
    
    <Dialog open={true} PaperProps={{sx: DialogStyle}} maxWidth={'md'} >
        <div className='chat-container'>

            <div className='Leftcol'>

               <div className='Headbox'>
                   <img src={execLogo} alt="User" />
                   <h2>Chats</h2>
                   <img src={morevert} alt="User" onClick={handleClick}/>
                   <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
               </div>

               <div className='search-box'>
                    <div className='Searchbar'>
                        <img src={searchicon} alt="" />
                        <Inputfield 
                           type='text'
                           placeholder='Search by id'
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="conversation-box">
                    <ul className="conversation-list">
                      {convos.length===0?<p>No chats found</p> :
                        convos.length > 0 && convos.map /*&& filteredConversations.map*/ ((conversation, i) => (
                          <div
                            key={conversation._id}
                            className={`conversation-item ${
                              selectedConversation?._id === conversation._id ? "selected" : "notselected"
                            }`}
                            onClick={() => handleConversationSelect(conversation._id)}
                          >
                            <div className="convoitems">
                                <img src={defuser} alt="" />
                                <div>
                                    <div className="rightconvid">{`ID: ${conversation._id}`}</div>
                                    <div className="leftstatus">Status: {conversation.status === "closed"? "Closed": conversation.executiveSocketID != null ? "Ongoing" : "Waiting"}</div>
                                </div>
                            </div>
                                <StyledDivider /> 
                          </div>
                        ))}
                   </ul>
                </div>

                <div className='status-filter'>
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
            <div className='Rightcol'>

                    {selectedConversation ? (
                    <>

                        <div className="conversation-header">
                        <img src={defuser} alt="" />
                        <div className="detailsheader">
                            <p className="chat-header">{` ${selectedConversation._id}`}</p>
                            <p className="statusheader">{` ${selectedConversation.status === "closed"? "Closed": selectedConversation.executiveSocketID != null ? "Ongoing" : "Waiting"}`}</p>
                        </div>
                        {selectedConversation.status === "closed" ? <></>: <button onClick={handleEndConversation}>End Chat</button>}
                        </div>

                        <div className="message-container" useRef={scrollRef}>
                        {/* Display messages for the selected conversation */}
                        {selectedConversation.messages.map((message, index) => (
                            <div
                            key={index}
                            className={`message-item ${message.sentBy === "bot" || message.sentBy === "executive" ? "outgoing" : 'incoming'}`}
                            >
                            <p>{message.text}</p>
                            </div>
                        ))}
                        </div>

                        {/* Type Message Box and Send Button */}
                        <div className="rightfooter">
                          { selectedConversation.status !== "closed" && <div className="input-box">
                              <img src={attachicon} alt="" />
                              <div className="type">

                                    <Inputfield2
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    />
                              </div>
                              <span
                                id="send-btn"
                                className="material-symbols-rounded"
                                onClick={handleSendMessage}
                              >
                                <svg viewBox="0 0 24 20" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>send</title><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
                              </span>
                          </div>
                          }
                        </div>
                    </>
                    ) : (
                    <div className='emptychat'>
                            <img src="https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg" alt="Emptychat-image" />
                            <p className='title'>Select a conversation to start chatting</p>
                            <p className='subtitle'>Send and receive messages seamlessly!</p>
                            <p className='subtitle'>Please report any bugs found.</p>
                            <StyledDivider2/>
                    </div>
                    )}
            </div>

        </div>
    </Dialog>
     
  </Component>
);
};

export default CustomerSupportChat;
// CustomerSupportChat.js
import "../../App.css";
import React, { useState } from "react";
import "./customer-support-chat.css";

const CustomerSupportChat = () => {
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
    const selectedConv = conversations.find(
      (conv) => conv.id === conversationId
    );
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
    if (selectedConversation && newMessage.trim() !== "") {
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { text: newMessage, type: "outgoing" },
              ],
            }
          : conv
      );
      setConversations(updatedConversations);
      setNewMessage("");
    }
  };

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
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                selectedConversation?.id === conversation.id ? "selected" : ""
              }`}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <div>{`ID: ${conversation.id}`}</div>
              <div>Status: {conversation.status}</div>
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
              <h2 className="chat-header">{`Conversation ID: ${selectedConversation.id} - Status: ${selectedConversation.status}`}</h2>
              <button>End Chat </button>
            </div>
            <div className="message-container">
              {/* Display messages for the selected conversation */}
              {selectedConversation.messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${message.type}`}
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
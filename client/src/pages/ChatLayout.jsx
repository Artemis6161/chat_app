// src/pages/ChatLayout.jsx
import { useState } from "react";
import ChatList from "./ChatList";
import ChatPage from "./ChatPage";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <ChatList onSelectChat={setSelectedChat} />
      <ChatPage selectedChat={selectedChat} />
    </div>
  );
};

export default ChatLayout;

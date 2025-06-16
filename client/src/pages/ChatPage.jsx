import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const ChatPage = ({ selectedChat }) => {
  const socket = useContext(SocketContext);
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const chatBoxRef = useRef(null);

 useEffect(() => {
  if (!selectedChat?._id) return;

  socket.emit("join chat", selectedChat._id);

  const handleMessageReceived = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  socket.on("message received", handleMessageReceived);

  return () => socket.off("message received", handleMessageReceived);
}, [selectedChat, socket]);


  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedChat._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

const sendMessage = async () => {
  if (!content.trim()) return;

  try {
    const res = await axios.post(
      "http://localhost:5000/api/messages",
      {
        content,
        chatId: selectedChat._id,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );

    

    // ✅ Just emit to socket
    socket.emit("new message", res.data);
    setContent("");
  } catch (err) {
    console.error("Send message failed:", err);
  }
};



  if (!selectedChat?._id) return <p>Select a chat to start messaging</p>;

  return (
    <div style={{ flex: 1 }}>
      <h2>
        Chat with{" "}
        {selectedChat.members.find((m) => m._id !== currentUser._id)?.username}
      </h2>
      <div
        id="chat-box"
        ref={chatBoxRef}
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid gray",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender.username ||"unknown"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type message..."
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
        Send
      </button>
    </div>
  );
};

export default ChatPage;

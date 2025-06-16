import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ChatList = ({ onSelectChat, selectedChat }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div style={{ width: "250px" }}>
      <h3>Your Chats</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {chats.map((chat) => (
          <li
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            style={{
              backgroundColor:
                selectedChat?._id === chat._id ? "#e0e0e0" : "#fff",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          >
            {chat.isGroupChat
              ? chat.name
              : chat.members.find((m) => m._id !== user._id)?.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;

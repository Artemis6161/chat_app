import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ChatList from "./pages/ChatList";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <>
              <div style={{ display: "flex", gap: "20px" }}>
                <ChatList
                  onSelectChat={setSelectedChat}
                  selectedChat={selectedChat}
                />
                <ChatPage selectedChat={selectedChat} />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

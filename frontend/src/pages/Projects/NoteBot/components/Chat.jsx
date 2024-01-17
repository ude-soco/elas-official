import React, { useState } from "react";
import { Paper, Typography, TextField, Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

const Chat = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    try {
      // Send the user's message to the chatbot API
      const apiUrl = "YOUR_CHATBOT_API_URL";
      const response = await axios.post(apiUrl, {
        message: inputMessage,
      });

      // Update the chat history with the user's message and the bot's response
      setChatHistory([...chatHistory, { role: "user", message: inputMessage }]);
      setChatHistory([...chatHistory, { role: "bot", message: response.data.message }]);

      // Clear the input field
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("There was an error connecting to the chat service. Please try again.");
    }
  };

  const handleSnackbarClose = () => {
    setError(null);
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
      }} >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* ... (other parts of the Chat component) */}

      {/* Input field for sending messages */}
      <div style={{ padding: '8px', borderTop: '1px solid #ccc' }}>
        <TextField
          label="Ask ChatGPT"
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)} />
        <Button variant="contained" style={{ marginTop: '8px' }} fullWidth onClick={sendMessage}>
          Send
        </Button>
      </div>

      {/* Snackbar for displaying errors */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={error} />
    </Paper>
  );
};

export default Chat;
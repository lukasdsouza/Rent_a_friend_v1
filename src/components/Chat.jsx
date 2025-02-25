// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';



const socket = io('http://localhost:3000'); // Certifique-se de que seu back-end esteja rodando nesta URL

const Chat = ({ activityId, user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', activityId);
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('message');
  }, [activityId]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('chatMessage', { activityId, user, message });
    setMessage('');
  };

  return (
    <div className="p-4 border rounded">
      <div className="h-64 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2"
          placeholder="Digite sua mensagem"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;

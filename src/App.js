import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { io } from "socket.io-client";
import React, { useState, useEffect } from 'react'

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});


function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  
  useEffect(() => {

    socket.on("connect", () => {
      setIsConnected(true)
    });

    socket.on("disconnect", () => {
     setIsConnected(false)
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };

  }, [])

  const sendPing = () => {
    socket.emit('ping');
    }

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
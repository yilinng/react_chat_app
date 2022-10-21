import React, { useState, useEffect } from 'react';
import SelectUsername from './SelectUsername';
import ChatPage from './ChatPage';

const Home = ({ socket }) => {

  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)

  useEffect(() => {

    const sessionID = localStorage.getItem("sessionID");
    
    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });
    
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    });

  }, [socket])


  return (
    <div className='app'>
      {usernameAlreadySelected === false ?
        <SelectUsername socket={socket} setUsernameAlreadySelected={setUsernameAlreadySelected} />
        : <ChatPage socket={socket} />}
   </div>
  );
};

export default Home;
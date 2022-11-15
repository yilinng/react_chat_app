import React, { useState } from 'react';
//import checkPageStatus from "../utils/functions"

const ChatFooter = ({ onMessage, clickUserRef }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    //socket.emit('input', message)
    onMessage(message)
    setMessage('');
  };

  const isVaild = () => {
    return this.input.length > 0;
  }

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={clickUserRef}
        />
        <button className="sendBtn" disabled={!isVaild}>SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
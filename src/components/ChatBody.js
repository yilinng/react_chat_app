import ChatFooter from './ChatFooter';
import React, { useState, useEffect } from "react";

const ChatBody = ({ certainUser, onMessage, clickUserRef, lastMessageRef, setCertainUser }) => {
  
  const [catchMsg, setCatchMsg] = useState([])

  const handleLeaveChat = () => {
    //window.location.reload();
    //syncUser()
    setCertainUser([])
  };

  /*
  const displaySender = (message, index) => {
      return (
        index === 0 ||
        user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
      );
  }
  */

  useEffect(() => {
    if (certainUser.length) {   
     setCatchMsg([...certainUser[0].messages])
    }
  }, [certainUser])
  

  return (
    <div className="chat__main">
      <header className="chat__mainHeader">
        <p>{ certainUser[0]?.username } Hangout with Colleagues</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {
          catchMsg.map((message, index) =>
            message.fromSelf ? (
              /* last message have to scroll down */
              index === catchMsg.length - 1 ? 
              <div className="message__chats sender" key={index} ref={lastMessageRef}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                    <p>{message.content} </p>
                  </div>
                <p className="message__time">{ message.time } </p>
              </div>
                :
              <div className="message__chats sender" key={index}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                    <p>{message.content} </p>
                  </div>
                <p className="message__time">{ message.time } </p>
              </div>
            
            ) : (
              /* last message have to scroll down */
                index === catchMsg.length - 1 ?
                <div className="message__chats recipient" key={index} ref={lastMessageRef}>
                  <p>{ certainUser[0]?.username }</p>
                  <div className="message__recipient">
                        <p>{message.content} </p>
                      </div>
                    <p className="message__time">{ message.time } </p>
                </div>  
                  : 
              <div className="message__chats recipient" key={index}>
                <p>{ certainUser[0]?.username }</p>
                <div className="message__recipient">
                      <p>{message.content} </p>
                    </div>
                  <p className="message__time">{ message.time } </p>
              </div>  
          )
        )
      }
      </div>

      <ChatFooter onMessage={onMessage} clickUserRef={clickUserRef} />
    </div>
  );
};

export default ChatBody;
//import { useNavigate } from 'react-router-dom';
import ChatFooter from './ChatFooter';
import { useEffect } from 'react';

const ChatBody = ({ lastMessageRef, typingStatus, socket, user, onMessage }) => {
  //const navigate = useNavigate();

  const handleLeaveChat = () => {
    //localStorage.removeItem('userName');
    //navigate('/');
    window.location.reload();
  };

  const displaySender = (message, index) => {
      return (
        index === 0 ||
        user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
      );
  }

  useEffect(() => {
    console.log(user.messages, 'from chatBody')

  }, [user.messages])


  return (
    <>
      <header className="chat__mainHeader">
        <p>{ user.username } Hangout with Colleagues</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {
          user.messages && user.messages.map((message, index) =>
          
            message.fromSelf ? (
            <div className="message__chats" key={index}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                  <p>{message.content} </p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={index}>
              <p>{user.username}</p>
              <div className="message__recipient">
                <p>{message.content} </p>
              </div>
            </div>
        )
        
        )
        
      }

        <div className="message__status">
          <p>{ typingStatus }</p>
        </div>
        <div ref={lastMessageRef} />
      </div>

      <ChatFooter socket={socket} onMessage={onMessage} />
    </>
  );
};

export default ChatBody;
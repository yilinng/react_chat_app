import React, { useState, useEffect } from "react";

const User = ({ user, users, setSelectedUser, setUsers, index }) => {

  const [message, setMessage] = useState(null)

  const handleClick = () => {
    const newUsers = [...users];
    setSelectedUser(user);
    user.hasNewMessages = false;
    newUsers[index] = user;
    setUsers(newUsers);
    
  }

  const messageSlice = () => {
   return message?.length > 30 ? message.substring(0, 30) + '...': message
  }

  useEffect(() => {
    //console.log(user.messages, 'user message....');
    if (user.messages.length > 0) {
      setMessage(user.messages[user.messages.length -1].content)
    }
  }, [user.messages.length, user])


  return (
    <div className="user" onClick={handleClick}>
      <div className='image'>
          <img src={user.url} alt="Avatar" className='avatar'/>
      </div>
          
      <div className='content'>

        <div className='name'>
          <h3>{ user.username } { user.self ? " yourself" : "" }</h3>

          <div className='rightSide'>

            {user.hasNewMessages ?
              <span className="new-messages">!</span> : 
               <div className='check'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" height="15" width="15">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              }    

            <h5>{ new Date().toLocaleTimeString().replace(',','') }</h5>
          </div>

        </div>

        <span>{ messageSlice() }</span>

      </div>
        
    </div>
  );
};

export default User;
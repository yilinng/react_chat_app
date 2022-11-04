import React, { useState, useEffect } from "react";

const User = ({ user, users, setSelectedUser, setUsers, index, selectedUser}) => {

  const [message, setMessage] = useState(null)
  const [selected, setSelected] = useState(false)
  const [time, setTime] = useState(null)

  const handleClick = () => {
    const newUsers = [...users];
    setSelectedUser({ ...user, hasNewMessages: false });
    const foundUser = newUsers[index];
    foundUser.hasNewMessages = false;
    newUsers[index] = foundUser;
    setUsers([...newUsers]);
    setTime(new Date().toLocaleTimeString().replace(',', ''));
    
    //list user who have same userId have to update!! 
    const userList = [...users];
    const findIndexFromUserList = userList.findIndex(element => element.userID === selectedUser?.userID);
    userList[findIndexFromUserList] = selectedUser;
    setUsers([...userList]);
  }

  const messageSlice = (msg) => {
    return msg?.length > 30 ? msg.substring(0, 30) + '...': msg
  }

  useEffect(() => {
    if (user.messages.length > 0) {   
      setMessage(user.messages[user.messages.length -1].content)
    }
  }, [user.messages.length, user.messages])

  useEffect(() => {
    if (selectedUser === null) return
    setSelected(selectedUser?.userID === user?.userID)

  }, [user, selectedUser, setSelected])

  useEffect(() => {
    if (selected) {
      console.log('selected!!, have same selectedUser', selectedUser);
      console.log('selected!!, have same user', user);
      
    }
  }, [selected, selectedUser, user])


  return (
    <div className={`user ${selected ? 'selected' : ''}`} onClick={handleClick}>
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

            <h5>{ time }</h5>
          </div>

        </div>

        <span>{ messageSlice(message) }</span>

      </div>
        
    </div>
  );
};

export default User;
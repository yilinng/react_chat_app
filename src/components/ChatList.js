import React, { useEffect, useState } from 'react';
import User from './User'
const ChatList = ({ socket }) => {
 
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    const getData = () => {
      fetch('https://api.thecatapi.com/v1/images/search?limit=7&page=10&order=Desc')
        .then(res => res.json())
        .then(data => setUsers(data))
    }
    getData()
  }, [])


  return (
    <div className="chatList">
      <div className="title">
        <h2>Messages</h2>
        <div className="edit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" height="20" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>

        </div>
      </div>

      <div className='search'>
        <form>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='searchIcon' height="20" width="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder='key some word...'/>
        </form>
      </div>
   
      
      { users.length ? users.map(user =>
        <User user={user} key={ user.id } />
      )
        :<div>not user can see</div>
      }
    </div>
  );
};

export default ChatList;
import React, { useEffect, useState, useRef } from 'react';
import ChatBody from './ChatBody';
import User from './User'


const ChatPage = ({ socket }) => {
  //const [messages, setMessages] = useState([]);
  //const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  
  const onMessage = (content) => {

     if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
       
     
       setSelectedUser(preState => ({
         ...preState,
         messages: [
           ...selectedUser.messages, 
          { content, fromSelf: true }
         ]
      }))
      
    }
  }

  useEffect(() => {
    socket.on("connect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

  }, [socket, users])

    useEffect(() => {

    socket.on("disconnect", () => {
      users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

  }, [socket, users])

  
  useEffect(() => {
    const getData = () => {
      fetch('https://api.thecatapi.com/v1/images/search?limit=1&page=10&order=Desc')
        .then(res => res.json())
        .then(data => setUsers(data))
    }
    //getData()
  }, [])

  const initReactiveProperties = (user) => {
    user.hasNewMessages = false;
  };

  useEffect(() => {
    socket.on("users", (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
        message.fromSelf = message.from === socket.userID;
      });
      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        setUsers([...users, user])
    });
    // put the current user first, and then sort by username
      const sortUsers = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(sortUsers)
    });
  }, [socket])

  useEffect(() => {
    socket.on("user connected", (user) => {
      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      setUsers([...users, user])
    });
  }, [socket, users])

  useEffect(() => {
        socket.on("user disconnected", (id) => {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.userID === id) {
              user.connected = false;
              break;
            }
          }
        });
  }, [socket, users])

  useEffect(() => {
    socket.on("private message", ({ content, from, to }) => {
      const fromSelf = socket.userID === from;
      const newUsers = [...users];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf
          });
          newUsers[i] = user;
          setUsers(newUsers)
          if (user !== selectedUser) {
            user.hasNewMessages = true;
            newUsers[i] = user;
            setUsers(newUsers)
          }
          break;
        }
      }
    
    });
    
     
  }, [socket, users, selectedUser])
 

/*
   useEffect(() => {
     socket.on('messageResponse', (data) => setMessages([...messages, data]));
   }, [socket, messages]);

   useEffect(() => {
     // 👇️ scroll to bottom every time messages change
     lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);

    useEffect(()=> {
      function fetchMessages() {
        fetch("http://localhost:4000/api")
        .then(response => response.json())
        .then(data => setMessages(data.messages))
      }
      fetchMessages()
  }, [])
  */
  return (
    <div className="chat">
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
    
        
        { users.length ? users.map((user, index) =>
          <User
            user={user}
            users={users}
            key={user.userID}
            setSelectedUser={setSelectedUser}
            setUsers={setUsers}
            index={index}
          />
        )
          :<div>not user can see</div>
        }
      </div>
      <div className="chat__main">
        { selectedUser &&
          <ChatBody
          lastMessageRef={lastMessageRef}
          socket={socket}
          user={selectedUser}
          onMessage={onMessage}
          />
        }
      </div>
    </div>
  );
};

export default ChatPage;
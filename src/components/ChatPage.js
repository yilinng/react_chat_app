import React, { useEffect, useState } from 'react';
import ChatBody from './ChatBody';
import User from './User'


const ChatPage = ({ socket }) => {

  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [certainUser, setCertainUser] = useState([])


  const onMessage = (content) => {

    if(selectedUser === null) return

      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });
      
      setSelectedUser(preState => ({
         ...preState,
         messages: [
           ...preState?.messages, 
          { content, fromSelf: true }
         ]
      }))

    setCertainUser([selectedUser]);
  
  }

  console.log('certainUser', certainUser)
  
  useEffect(() => {
    if (users.length > 0 && selectedUser !== null) {
      setCertainUser([selectedUser]);
    }
  }, [users, selectedUser])

/*
  useEffect(() => {
    const getData = () => {
      fetch('https://api.thecatapi.com/v1/images/search?limit=1&page=10&order=Desc')
        .then(res => res.json())
        .then(data => setUsers(data))
    }
    //getData()
  }, [])
*/
  const initReactiveProperties = (user) => {
    user.hasNewMessages = false;
  };

  useEffect(() => {

    const listen = (users) => {
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
    };
    socket.on("users", listen);

    return () => socket.off("users", listen)

  
  }, [socket, users])

  useEffect(() => {

    const listen = (user) => {
      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      setUsers([...users, user])
    };
    socket.on("user connected", listen);

    return() => socket.off("user connected", listen)

  }, [socket, users])

  useEffect(() => {

    const listen = (id) => {
      const allUsers = [...users];
      for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.userID === id) {
              user.connected = false;
              allUsers[i] = user;
              setUsers([...allUsers]);
              break;
            }
          }
    }

    socket.on("user disconnected", listen);
    
    return () => {
      socket.off('user disconnected', listen)
    }
    
  }, [users, socket])


  useEffect(() => {
    
    const listen = ({ content, from, to }) => {

      const fromSelf = socket.userID === from;
      const newUsers = [...users];

      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        // user socket === true -> to 
        if (user.userID === (fromSelf ? to : from)) {
        
          console.log('private message work.....');
          /*
          user.messages.push({
            content,
            fromSelf,
          });
          
          selectedUser have to sync user, when have a selecteduser, 
          first message run twice, other run normal.
          no pick any selectedUser will run normal.
      
          if (selectedUser?.messages[0]) {
            continue;
          }
          */
          selectedUser?.messages.push({
            content,
            fromSelf,
          })

          user = selectedUser
        
          newUsers[i] = user;
          setUsers(newUsers);
        
          if (user.userID !== selectedUser.userID) {
            user.hasNewMessages = true;
            newUsers[i] = user;
            setUsers(newUsers);
          }
          break;
        }
      }
    };
   
    socket.on("private message", listen);

    return () => {
      socket.off("private message", listen)
    }
  
  }, [selectedUser, socket, users])


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
    
        
        {users.length ? users.map((user, index) =>
          <User
            user={user}
            users={users}
            key={user.userID}
            setSelectedUser={setSelectedUser}
            setUsers={setUsers}
            index={index}
            selectedUser={selectedUser}
          />
        )
          :<div>not user can see</div>
        }
      </div>
      <div className="chat__main">
 
        { certainUser.length > 0 &&
          <ChatBody
          selectedUser={selectedUser}
          certainUser={certainUser}
          onMessage={onMessage}
          />
        }
      </div>
    </div>
  );
};

export default ChatPage;
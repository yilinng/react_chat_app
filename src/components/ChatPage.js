import React, { useEffect, useState, useRef } from 'react';
import ChatBody from './ChatBody';
import ChatList from './ChatList';

const ChatPage = ({ socket }) => {

  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [certainUser, setCertainUser] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
  

  const clickUserRef = useRef(null);
  const lastMessageRef = useRef(null)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, []);

  const isMobile = width < 768;

  //check object is empty
  function isEmpty(obj) { 
    for (let x in obj) {
      if (obj.hasOwnProperty(x)) return false
    }
   return true;
  }

  const onMessage = (content) => {

    if(isEmpty(selectedUser)) return

      socket.emit("private message", {
        content,
        to: selectedUser.userID,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      });
      
      setSelectedUser(preState => ({
         ...preState,
         messages: [
           ...preState?.messages, 
           {
             content,
             fromSelf: true,
             time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
           }
        ],
      }))
    
  }

  //console.log('certainUser', certainUser)

  useEffect(() => {
    if (users.length > 0 && !isEmpty(selectedUser)) {
      setCertainUser([selectedUser]);
    }
  }, [users, selectedUser])


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

    const syncUser = () => {  
      const userList = [...users];
      const findIndexFromUserList = userList.findIndex(element => element.userID === selectedUser?.userID);
      userList[findIndexFromUserList] = selectedUser;
      setUsers([...userList]);
  } 

  useEffect(() => {
    
    const listen = ({ content, from, to, time }) => {

      for (let i = 0; i < users.length; i++) {

        const fromSelf = socket.userID === from;
        const newUsers = [...users];
        const user = users[i];
        // user socket === true -> to 
        if (user.userID === (fromSelf ? to : from)) {
          /*
          user.messages.push({
            content,
            from,
            to,
            fromSelf,
            time
          });
       
          newUsers[i] = user;
          setUsers(newUsers);
          */
          if (user.userID === selectedUser.userID) {
            //find selectUser messages which is same as selectedUser
            
              setSelectedUser(preState => ({
                ...preState,
                messages: [
                  ...preState?.messages, 
                  {
                    content,
                    fromSelf,
                    time
                  }
                ],
              }))
              
          } else {
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

   useEffect(() => {
     // 👇️ scroll to bottom when click user
     if (certainUser.length) {
        clickUserRef.current?.scrollIntoView({ behavior: 'smooth' });
        clickUserRef.current?.focus();
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
     }
   }, [certainUser]);

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
      { isMobile ?
        !certainUser.length ?
          <ChatList
            users={users}
            setUsers={setUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            syncUser={syncUser}
          />
          :
          <ChatBody
            certainUser={certainUser}
            onMessage={onMessage}
            clickUserRef={clickUserRef}
            lastMessageRef={lastMessageRef}
            setCertainUser={setCertainUser}
          />
        :
        <>
          <ChatList
            users={users}
            setUsers={setUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            syncUser={syncUser}
          />
          
          { certainUser.length > 0 ?
          < ChatBody          
            certainUser={certainUser}
            onMessage={onMessage}
            clickUserRef={clickUserRef}
            lastMessageRef={lastMessageRef}
            setCertainUser={setCertainUser}
            />
            :
            <div className="noPickUser">Picking user, then start a conversation!</div>
          }
        </>
      }
    </div>
  );
};

export default ChatPage;
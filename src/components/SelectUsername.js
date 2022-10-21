import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const SelectUsername = ({ socket, setUsernameAlreadySelected }) => {
  //const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('input', username)
    setUsernameAlreadySelected(true)
    socket.auth = { username }
    socket.connect()
  };

  const isValid = () => {
    return username.length > 2
  }

  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        className="username__input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="home__cta" disabled={!isValid}>SIGN IN</button>
    </form>
  );
};

export default SelectUsername;
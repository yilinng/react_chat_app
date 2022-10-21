import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { io } from "socket.io-client";

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
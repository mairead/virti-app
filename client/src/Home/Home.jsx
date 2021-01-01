import React from "react";
import { Link } from "react-router-dom";

import "./Home.scss";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
    <div className="home-container">
      <h1>Welcome to virti chat</h1>
      <p>Please choose a room</p>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={handleRoomNameChange}
        className="text-input-field"
      />
      <Link to={`/${roomName}`} className="enter-room-button">
        Join room
      </Link>
    </div>
  );
};

export default Home;

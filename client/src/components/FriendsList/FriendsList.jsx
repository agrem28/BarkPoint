import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import './FriendsList.css';

const FriendsList = () => (
  <div className="Profile">
    <Navbar />
    <Sidebar />
    <div className="friends">
      <h1>Friends List</h1>
    </div>
    <div className="messages">
      <h1>Messages</h1>
      <input />
    </div>
  </div>
);

export default FriendsList;

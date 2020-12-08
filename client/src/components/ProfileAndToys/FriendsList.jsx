import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FriendsList = () => (
  <div className="Profile">
    <Navbar />
    <Sidebar />
    <div className="center">
      <input />
      <div className="friends">
        <h1>This is your Friends list.</h1>
      </div>
      <div className="messages">
        <h1>this is the messages</h1>
      </div>
    </div>
  </div>
);

export default FriendsList;

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FriendsList = () => (
  <div className="Profile">
    <Navbar />
    <Sidebar />
    <div className="center">
      <h4>search for dogs</h4>
      <input />
      <div className="main">
        <div className="friends">
          <h1>tom</h1>
          <h1>ben</h1>
          <h1>tim</h1>
        </div>
        <div className="messages">
          <h3>tom</h3>
          <div>heyy</div>
          <h3>billy</h3>
          <div>whats up man</div>
        </div>
      </div>
    </div>
  </div>
);

export default FriendsList;

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FriendsList = () => {
  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <h1>This is your Friends list.</h1>
    </div>
  );
};

export default FriendsList;

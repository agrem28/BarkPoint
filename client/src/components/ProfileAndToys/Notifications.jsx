import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Notifications = () => {
  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <h1>This is your notifications list.</h1>
    </div>
  );
};

export default Notifications;

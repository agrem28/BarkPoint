import React from 'react';
// import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import './Notifications.css';

const Notifications = () => (
  <div className="Profile">
    <Navbar />
    <Sidebar />
    <div className="notif-container">
      <h1>Notifications</h1>
      <div id="change-number-msg"> want to change phone number currently receiving notifications? </div>
      <input />
      <button type="button">change number</button>
    </div>
  </div>
);

export default Notifications;

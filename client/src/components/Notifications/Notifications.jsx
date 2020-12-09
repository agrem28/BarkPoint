/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import './Notifications.css';

const Notifications = () => {
  const [notifs, setNotif] = useState([]);
  const [form, setForm] = useState({ number: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // handles when a notification is created
  const handleNotif = async () => {
    const { data } = await axios.get('/session');
    const { email } = data;
    console.log('n', form.changeNum);
    await axios.put(`/data/notifications/${email}`, { number: form.changeNum });
  };

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <div className="notif-container">
        <h1 className="notif-header">Notifications</h1>
        <div className="all-notif"> All notifications:</div>
        <div>
          {/* {notifs.map((text, i) => (
          <div key={text + i}></div>
          <h2>{text}</h2>
        )})} */}
        </div>
        <div id="change-number-msg"> want to change phone number currently receiving notifications? </div>
        <input className="change-num-input" placeholder="ex:12345678901" onChange={handleChange} name="changeNum" />
        <button className="change-num-btn" type="button" onClick={handleNotif}>change number</button>
      </div>
    </div>
  );
};
export default Notifications;

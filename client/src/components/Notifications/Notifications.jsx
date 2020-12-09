/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import './Notifications.css';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [form, setForm] = useState({ number: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNumChange = async () => {
    const { data } = await axios.get('/session');
    const { email } = data;
    console.log('changednum', form.changeNum);
    await axios.put(`/data/notifications/${email}`, { number: form.changeNum });
  };

  const getNotifs = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/data/notifications/${data.email}`).then(({ data }) => {
        console.log('DATA', data.notifs);
        if (notifs.length === 0) {
          setNotifs(data.notifs);
        }
        axios.delete(`/data/notifications/${data.email}`);
      });
    });
  };

  useEffect(() => {
    getNotifs();
  }, []);

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <div className="notif-container">
        <h1 className="notif-header">Notifications</h1>
        <div className="all-notif"> All notifications:</div>
        {notifs.map((notif) => (
          <div className="notif-list">
            <h3>{notif}</h3>
          </div>
        ))}
        <div id="change-number-msg"> want to change phone number currently receiving notifications? </div>
        <input className="change-num-input" placeholder="ex:12345678901" onChange={handleChange} name="changeNum" />
        <button className="change-num-btn" type="button" onClick={handleNumChange}>change number</button>
      </div>
    </div>
  );
};
export default Notifications;

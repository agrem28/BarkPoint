import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import FriendRequests from './FriendRequests.jsx';
import './Notifications.css';
import notifImg from './notif3.png';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center',
    justify: 'center',
  },
  inputField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    justify: 'center',
    marginTop: '2%',
  },
}));

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [form, setForm] = useState({ number: '' });
  const classes = useStyles();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getNotifs = () => {
    axios.get('/session')
      .then(({ data }) => axios.get(`/data/notifications/${data.email}`))
      .then(({ data }) => {
        if (notifs.length === 0) {
          setNotifs(data.notifs);
        }
        axios.delete(`/data/notifications/${data.email}`);
      });
  };

  const updateNotifs = () => {
    axios.get('/session')
      .then(({ data }) => axios.get(`/data/notifications/${data.email}`))
      .then(({ data }) => {
        setNotifs(data.notifs);
      });
  };

  const handleNumChange = async () => {
    const { data } = await axios.get('/session');
    const { email } = data;
    await axios.put(`/data/notifications/${email}`, { number: form.changeNum });
    updateNotifs();
  };

  useEffect(() => {
    getNotifs();
  }, []);

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <div className="notif-container">
        <Typography component="h1" variant="h2" className={classes.title} id="notifs-header">Notifications</Typography>
        <Typography component="h1" variant="h5" className={classes.title}> All notifications:</Typography>
        {notifs.map((notif) => {
          if (typeof notif === 'object') {
            return (
              <div className="notif-list">
                <Typography component="h6" variant="h6" className={classes.title}>{notif.body}</Typography>
              </div>
            );
          }
          return (
            <div className="notif-list">
              <Typography component="h6" variant="h6" className={classes.title}>{notif}</Typography>
            </div>
          );
        })}
        <FriendRequests />
        <Typography className={classes.title} id="change-number-msg"> want to change phone number currently receiving notifications? </Typography>
        <TextField id="standard-basic" className={classes.inputField} placeholder="ex:12345678901" onChange={handleChange} name="changeNum" />
        <Button className={classes.inputField} color="primary" id="change-num-btn" onClick={handleNumChange}>change number</Button>
        <img alt="" src={notifImg} className="img" />
      </div>
    </div>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import friendpic from './friendpic3.png';
import './FriendsList.css';

const socket = io();

const useStyles = makeStyles(() => ({
  marginAutoContainer: {
    display: 'flex',
  },
  marginAutoItem: {
    margin: 'auto',
  },
  alignItemsAndJustifyContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
  },
  pupBudzHeader: {
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15%',
    marginTop: '5%',
  },
  addFriendButton: {
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '30%',
    marginTop: '5%',
    padding: '10px',
  },
}));

const FriendsList = () => {
  const classes = useStyles();
  const [currentDms, setCurrentDms] = useState({});
  const [messageText, setMessageText] = useState('');
  const [friendToSearch, setFriendToSearch] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  const [messages, setMessages] = useState({});
  const friendSearchOnChange = (event) => {
    const friend = event.target.value;
    setFriendToSearch(friend);
  };

  // Sends friend request to user being searched...
  const sendFriendRequest = () => {
    axios.get('/session').then(({ data }) => {
      axios
        .get(`/findFriend/${friendToSearch}/${data.name}`)
        .then(() => {})
        .catch((err) => console.info(err));
      console.info('FRIEND', friendToSearch);
    });
  };

  // Grabs the current users friendsList...
  const getFriendsList = () => {
    console.info('outside');
    axios.get('/session').then(({ data }) => axios.get(`/friends/${data.name}`))
      .then(({ data }) => {
        console.info('DATA', data);
        setFriendsList(data);
      });
  };

  const getMessagesList = () => {
    axios.get('/session')
      .then(({ data }) => axios.get(`/messages/${data.email}`))
      .then(({ data }) => setMessages(data));
  };

  const clickHandler = () => {
    axios.get('/session')
      .then(({ data }) => {
        const time = new Date();
        const newMessage = {
          name: data.name,
          message: messageText,
          time: String(time).replace('GMT-0600 (Central Standard Time)', ''),
        };
        const exampleMessage = messages;
        if (exampleMessage[currentDms.name]) {
          exampleMessage[currentDms.name] = [
            ...messages[currentDms.name],
            newMessage,
          ];
        } else {
          exampleMessage[currentDms.name] = [newMessage];
        }
        setMessageText('');
        axios.post(`/messages/${data.email}`, {
          message: newMessage,
          user: currentDms.email,
          from: data.name,
          to: currentDms.name,
        }).then(() => socket.emit('sent'))
          .catch((err) => console.warn(err));
      });
  };

  socket.on('recived', () => getMessagesList());

  useEffect(() => getFriendsList(), []);

  useEffect(() => getMessagesList(), {});

  return (
    <div className="Profile">
      <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Roboto:wght@300&display=swap" rel="stylesheet" />
      <Navbar />
      <Sidebar />
      <div className="friends-container">
        <div className="main">
          <div className="friends">
            <Typography component="h1" variant="h4" className={classes.pupBudzHeader}>Pup Budz</Typography>
            <TextField
              className={classes.alignItemsAndJustifyContent}
              id="standard-basic"
              placeholder="Search for Budz"
              onChange={friendSearchOnChange}
              display="flex"
              alignItems="center"
              justifyContent="center"

            />
            {/* <Box> */}
            <Button
              className={classes.addFriendButton}
              display="flex"
              alignItems="center"
              justifyContent="center"
              variant="text"
              color="primary"
              onClick={sendFriendRequest}
            >
              Add Friend
            </Button>
            {/* </Box> */}
            {friendsList.map((friend) => (
              <div className="friendsList">
                <h3 onClick={() => setCurrentDms(friend)}>{friend.name}</h3>
              </div>
            ))}
          </div>
          <div className="messages">
            {messages[currentDms.name]
              ? messages[currentDms.name].map(({ name, message, time }) => (
                <div>
                  <h2>{name}</h2>
                  <div>{message}</div>
                  <div>{time}</div>
                </div>
              )) : null}
            <div>
              { currentDms.name
                ? (
                  <div>
                    <TextField
                      id="standard-basic"
                      placeholder="type a message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <Button
                      variant="text"
                      color="primary"
                      onClick={clickHandler}
                    >
                      send message
                    </Button>
                  </div>
                ) : null}
              <img alt="" className="friend-pic" src={friendpic} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;

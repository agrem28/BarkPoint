import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import friendpic from './friendpic.png';
import './FriendsList.css';
import SearchFriend from './Search.jsx';

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
    // color: 'white',
    // textAlign: 'center',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginBottom: '10%',
    // marginTop: '5%',
  },
}));
const FriendsList = () => {
  const classes = useStyles();
  const [currentDms, setCurrentDms] = useState({});
  const [messageText, setMessageText] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState({});
  const [user, setUser] = useState('');

  const getUsers = () => {
    axios.get('/findUsers').then(({ data }) => {
      setUsers(data.map((profile) => profile.name));
    });
  };

  const getUser = () => {
    axios.get('/session').then(({ data }) => {
      setUser(data.name);
    });
  };

  useEffect(() => getUser(), []);

  // const friendSearchOnChange = (event) => {
  //   setShowSuggestions(true);
  //   const { value } = event.target;
  //   let sortedSuggestions = [];
  //   if (value.length > 0) {
  //     const regex = new RegExp(`${value}`, 'i');
  //     sortedSuggestions = users.sort().filter((v) => regex.test(v));
  //   }
  //   setSuggestions(sortedSuggestions);
  //   setFriendToSearch(value);
  // };
  // Sends friend request to user being searched...
  // const sendFriendRequest = () => {
  //   axios.get('/session').then(({ data }) => {
  //     axios
  //       .get(`/findFriend/${friendToSearch}/${data.name}`)
  //       .then(() => {})
  //       .catch((err) => console.info(err));
  //   });
  // };
  // Grabs the current users friendsList...
  const getFriendsList = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/friends/${data.name}`).then(({ data }) => {
        setFriendsList(data);
      });
    });
  };
  const getMessagesList = () => {
    axios
      .get('/session')
      .then(({ data }) => axios.get(`/messages/${data.email}`))
      .then(({ data }) => setMessages(data));
  };
  const clickHandler = () => {
    axios.get('/session').then(({ data }) => {
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
      axios
        .post(`/messages/${data.email}`, {
          message: newMessage,
          user: currentDms.email,
          from: data.name,
          to: currentDms.name,
        })

        .then(() => socket.emit('sent'));
    });
  };
  const handleUnfriend = (id) => {
    axios.put('/unfriend', { user, id }).then(() => {
      // setFriendsList(data);
      getFriendsList();
      socket.emit('delete');
    });
  };
  // const handleSuggestionChoice = (suggestion) => {
  //   setShowSuggestions(false);
  //   const input = document.getElementById('friendInput');
  //   input.value = suggestion;
  //   setFriendToSearch(input.value);
  // };
  useEffect(() => {
    getFriendsList();
  }, []);

  socket.on('approved', () => getFriendsList());

  socket.on('recived', () => getMessagesList());
  socket.on('update', () => getFriendsList());

  useEffect(() => getFriendsList(), []);
  useEffect(() => getMessagesList(), {});

  return (
    <div className="Profile">
      {!users.length ? getUsers() : null}
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Roboto:wght@300&display=swap"
        rel="stylesheet"
      />
      <Navbar />
      <Sidebar />
      <div className="friends-container">
        <div className="main">
          <div className="friends">
            <div id="search-and-header">
              <Typography
                Component="h1"
                variant="h2"
                class={classes.pupBudzHeader}
                id="pupBudzHeader"
              >
                {' '}
                Pup Budz
              </Typography>
              <SearchFriend />
            </div>
            <div className="listOfFriends">
              {friendsList.map((friend) => (
                <div className="friendsList">
                  <h4
                    className="friendName"
                    onClick={() => setCurrentDms(friend)}
                  >
                    {friend.name}
                  </h4>
                  <Button
                    className="unfriendBtn"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleUnfriend.bind(this, String(friend._id))}
                  >
                    Unfriend
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div id="helper-div" />
          <div className="messages">
            <Typography
              Component="h3"
              variant="h4"
              className={classes.alignItemsAndJustifyContent}
              id="msg-receiver-header"
            >
              {currentDms.name}
            </Typography>
            {messages[currentDms.name]
              ? messages[currentDms.name].map(({ name, message, time }) => (
                <div style={{ marginTop: '30px' }}>
                  <div className={name === user ? 'sender' : 'reciever'}>
                    <div id="msgText">{message}</div>
                  </div>
                  <div
                    className={
                          name === user ? 'senderTime' : 'recieverTime'
                        }
                  >
                    <div>{time}</div>
                  </div>
                </div>
              ))
              : null}
            <div id="sticky-container">
              {currentDms.name ? (
                <div className="sendMsgContainer">
                  <TextField
                    className={classes.alignItemsAndJustifyContent}
                    id="outlined-basic"
                    placeholder="what's on your mind?"
                    variant="outlined"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.alignItemsAndJustifyContent}
                    size="small"
                    id="sendMsgButton"
                    onClick={clickHandler}
                  >
                    send
                  </Button>
                </div>
              ) : null}
            </div>
            <img alt="" className="friend-pic" src={friendpic} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FriendsList;

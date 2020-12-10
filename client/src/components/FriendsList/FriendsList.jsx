import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';

require('./FriendsList.css');

const socket = io();

const FriendsList = () => {
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
      <Navbar />
      <Sidebar />
      <div className="center">
        <h1>Pup Budz</h1>
        <div className="main">
          <div className="friends">
            <input
              placeholder="Search for Budz"
              onChange={friendSearchOnChange}
            />
            <button onClick={sendFriendRequest}>Add Friend</button>
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
                    <input
                      placeholder="type a message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      onClick={clickHandler}
                    >
                      send message
                    </button>
                  </div>
                ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;

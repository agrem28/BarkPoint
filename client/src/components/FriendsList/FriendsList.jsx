/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Sidebar from '../ProfileAndToys/Sidebar.jsx';
import axios from 'axios';
require('./FriendsList.css');

const FriendsList = () => {
  console.log('Helllooo');
  const [currentDms, setCurrentDms] = useState('Tee');
  const [messageText, setMessageText] = useState('');
  const [friendToSearch, setFriendToSearch] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  let exampleMessage = {
    Tee: [
      { name: 'Tee', message: 'hey man how your day' },
      { name: 'Billy', message: 'its been good' },
    ],
    Amber: [
      { name: 'Amber', message: 'does the site looks good' },
      { name: 'Billy', message: 'sure does' },
    ],
    Andrew: [
      { name: 'Andrew', message: 'i like this youtube video' },
      { name: 'Billy', message: 'same' },
    ],
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  const [messages, setMessages] = useState(exampleMessage);
  const friendSearchOnChange = (event) => {
    let friend = event.target.value;
    setFriendToSearch(friend);
  };

  //Sends friend request to user being searched...
  const sendFriendRequest = () => {
    axios.get('/session').then(({ data }) => {
      axios
        .get(`/findFriend/${friendToSearch}/${data.name}`)
        .then(() => {})
        .catch((err) => console.log(err));
      console.log('FRIEND', friendToSearch);
    });
  };

  //Grabs the current users friendsList...
  const getFriendsList = () => {
    console.log('outside');
    axios.get('/session').then(({ data }) => {
      axios.get(`/friends/${data.name}`).then(({ data }) => {
        // console.log('DATA', data);
        setFriendsList(data);
      });
    });
  };

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
                <h3>{friend.name}</h3>
              </div>
            ))}
          </div>
          <div className="messages">
            {messages[currentDms].map(({ name, message }) => (
              <div>
                <h2>{name}</h2>
                <div>{message}</div>
              </div>
            ))}
            <input
              placeholder="type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button
              onClick={() => {
                const newMessage = {
                  name: 'Billy',
                  message: messageText,
                };
                exampleMessage = messages;
                exampleMessage[currentDms] = [
                  ...messages[currentDms],
                  newMessage,
                ];
                setMessages(exampleMessage);
                setMessageText('');
              }}
            >
              send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;

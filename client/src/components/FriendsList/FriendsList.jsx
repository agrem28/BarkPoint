/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Sidebar from '../ProfileAndToys/Sidebar.jsx';

const FriendsList = () => {
  const [currentDms, setCurrentDms] = useState('Tee');
  const [messageText, setMessageText] = useState('');
  const exampleUser = ['Tee', 'Amber', 'Andrew'];
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
  const [messages, setMessages] = useState(exampleMessage);
  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <div className="center">
        <h1>Pup Budz</h1>
        <div className="main">
          <div className="friends">
            <input placeholder="Search for Budz" />
            <button>add</button>
            {exampleUser.map((user) => (
              <h1 onClick={() => setCurrentDms(user)}>{user}</h1>
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

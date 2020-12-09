/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';

require('./FriendsList.css');

const FriendsList = () => {
  const [currentDms, setCurrentDms] = useState({});
  const [messageText, setMessageText] = useState('');
  const [friendToSearch, setFriendToSearch] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  // let exampleMessage = {
  //   Tee: [
  //     { name: 'Tee', message: 'hey man how your day' },
  //     { name: 'Billy', message: 'its been good' },
  //   ],
  //   Amber: [
  //     { name: 'Amber', message: 'does the site looks good' },
  //     { name: 'Billy', message: 'sure does' },
  //   ],
  //   Andrew: [
  //     { name: 'Andrew', message: 'i like this youtube video' },
  //     { name: 'Billy', message: 'same' },
  //   ],
  // };

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
        .catch((err) => console.log(err));
      console.log('FRIEND', friendToSearch);
    });
  };

  // Grabs the current users friendsList...
  const getFriendsList = () => {
    console.log('outside');
    axios.get('/session').then(({ data }) => {
      axios.get(`/friends/${data.name}`).then(({ data }) => {
        // console.log('DATA', data);
        setFriendsList(data);
      });
    });
  };

  const getMessagesList = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/messages/${data.email}`).then(({ data }) => {
        setMessages(data);
      });
    });
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  useEffect(() => {
    getMessagesList();
  }, {});

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
                      onClick={() => {
                        axios.get('/session').then(({ data }) => {
                          const time = new Date();
                          const newMessage = {
                            name: data.name,
                            message: messageText,
                            time: String(time),
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
                          setMessages(exampleMessage);
                          setMessageText('');
                          axios.post(`/messages/${data.email}`, {
                            message: exampleMessage,
                            user: currentDms.email,
                            from: data.name,
                            to: currentDms.name,
                          });
                        });
                      }}
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

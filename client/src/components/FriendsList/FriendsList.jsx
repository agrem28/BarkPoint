/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';

require('./FriendsList.css');

const FriendsList = () => {
  const [currentDms, setCurrentDms] = useState({});
  const [messageText, setMessageText] = useState('');
  const [friendToSearch, setFriendToSearch] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  let users;

  const [messages, setMessages] = useState({});
  let user;

  const getUsers = () => {
    axios.get('/findUsers').then(({ data }) => {
      data = data.map((user) => user.name);
      users = data;
    });
  };

  useLayoutEffect(() => {
    axios.get('/session').then(({ data }) => {
      user = data.name;
      console.log('USER', user);
    });
  });

  const friendSearchOnChange = (event) => {
    const value = event.target.value;

    let sortedSuggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, 'i');
      sortedSuggestions = users.sort().filter((v) => regex.test(v));
    }
    setSuggestions(sortedSuggestions);
    setFriendToSearch(value);
  };

  // Sends friend request to user being searched...
  const sendFriendRequest = () => {
    console.log('SUCCESS');
    axios.get('/session').then(({ data }) => {
      axios
        .get(`/findFriend/${friendToSearch}/${data.name}`)
        .then(() => {})
        .catch((err) => console.log(err));
    });
  };

  // Grabs the current users friendsList...
  const getFriendsList = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/friends/${data.name}`).then(({ data }) => {
        console.log('DATAaaa', data);
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

  const handleUnfriend = (id) => {
    axios.put('/unfriend', { user, id }).then(({ data }) => {
      // setFriendsList(data);
      console.log('jdjdjdjdj');
      getFriendsList();
    });
  };

  const handleSuggestionChoice = (suggestion) => {
    const input = document.getElementById('friendInput').value;
    input.value = suggestion;
    setFriendToSearch(input.value);
    console.log('SUGGESTION CHOICE', suggestion);
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  useEffect(() => {
    getMessagesList();
  }, {});

  return (
    <div className="Profile">
      {!users ? getUsers() : null}
      <Navbar />
      <Sidebar />
      <div className="center">
        <h1>Pup Budz</h1>
        <div className="main">
          <div className="friends">
            <div className="inputAndSuggestions">
              <input
                id="friendInput"
                type="text"
                placeholder="Search for Budz"
                onChange={friendSearchOnChange}
                className="addFriendInput"
                autocomplete="off"
              />
              <input
                type="submit"
                className="addFriendButton"
                value="Add Friend"
                onClick={sendFriendRequest}
              />
              {suggestions.map((suggestion) => {
                return (
                  <div
                    className="suggestions"
                    onClick={handleSuggestionChoice.bind(this, suggestion)}
                  >
                    {suggestion}
                  </div>
                );
              })}
            </div>
            <div className="listOfFriends">
              {friendsList.map((friend) => (
                <div className="friendsList">
                  <h3 onClick={() => setCurrentDms(friend)}>{friend.name}</h3>
                  <button
                    onClick={handleUnfriend.bind(this, String(friend._id))}
                  >
                    Unfriend
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="messages">
            {messages[currentDms.name]
              ? messages[currentDms.name].map(({ name, message, time }) => (
                  <div>
                    <h2>{name}</h2>
                    <div>{message}</div>
                    <div>{time}</div>
                  </div>
                ))
              : null}
            <div>
              {currentDms.name ? (
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
                          message: newMessage,
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

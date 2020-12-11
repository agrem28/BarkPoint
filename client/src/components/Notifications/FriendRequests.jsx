import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestResponse, setFriendRequestResponse] = useState('');

  //Refactor code to not use state to get the user. Instead call the "/session" route every time you need it.
  useEffect(() => {
    getFriendRequests();
  }, []);

  const getFriendRequests = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/friendRequests/${data.name}`).then(({ data }) => {
        console.log('WEIRD', data);
        setFriendRequests(data);
      });
    });
  };

  const responseToFriendRequest = (id, response) => {
    axios.get('/session').then(({ data }) => {
      axios
        .put('/responseToFriendRequest', { id, user: data.name, response })
        .then(({ data }) => {
          console.log(data, '-----');
          setFriendRequestResponse(data);

          setTimeout(() => {
            console.log('set timeout');
            setFriendRequestResponse('');
            getFriendRequests();
          }, 2000);
        });
    });
  };

  return (
    <div className="friendRequests">
      <h1>Friend Requests</h1>
      {friendRequestResponse ? (
        <div className="requestResponse">{friendRequestResponse}</div>
      ) : null}
      {friendRequests.map((friendRequest) => {
        return (
          <div>
            <div>{friendRequest.name}</div>
            <button
              onClick={responseToFriendRequest.bind(
                this,
                friendRequest._id,
                'Accepted'
              )}
            >
              Accept
            </button>
            <button
              onClick={responseToFriendRequest.bind(
                this,
                friendRequest._id,
                'Declined'
              )}
            >
              Decline
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FriendRequests;

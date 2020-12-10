import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestResponse, setFriendRequestResponse] = useState('');
  let user;

  useLayoutEffect(() => {
    axios
      .get('/session')
      .then(({ data }) => {
        user = data.name;
      })
      .then(() => {
        getFriendRequests();
      });
  });

  const getFriendRequests = () => {
    axios.get(`/friendRequests/${user}`).then(({ data }) => {
      setFriendRequests(data);
    });
  };

  const responseToFriendRequest = (id, response) => {
    axios
      .put('/responseToFriendRequest', { id, user, response })
      .then(({ data }) => {
        setFriendRequestResponse(data);
        setTimeout(() => {
          setFriendRequestResponse('');
        }, 2000);
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

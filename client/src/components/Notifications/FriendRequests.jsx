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

  const acceptFriendRequest = () => {
    console.log('ACCEPTED FRIEND REQUEST');
  };
  const declineFriendRequest = (id) => {
    axios.put('/declineFriendRequest', { id, user }).then(({ data }) => {
      setFriendRequestResponse(data);
      setTimeout(() => {
        setFriendRequestResponse('');
      }, 2000);
    });
    console.log('DECLINED FRIEND REQUEST');
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
            <button onClick={acceptFriendRequest.bind(this, friendRequest._id)}>
              Accept
            </button>
            <button
              onClick={declineFriendRequest.bind(this, friendRequest._id)}
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

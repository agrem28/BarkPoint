import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestResponse, setFriendRequestResponse] = useState('');

  useEffect(() => {
    getFriendRequests();
  }, []);

  const getFriendRequests = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/friendRequests/${data.name}`).then(({ data }) => {
        setFriendRequests(data);
      });
    });
  };

  const responseToFriendRequest = (id, response) => {
    axios.get('/session').then(({ data }) => {
      axios
        .put('/responseToFriendRequest', { id, user: data.name, response })
        .then(({ data }) => {
          setFriendRequestResponse(data);

          setTimeout(() => {
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
      {friendRequests.map((friendRequest) => (
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
      ))}
    </div>
  );
};

export default FriendRequests;

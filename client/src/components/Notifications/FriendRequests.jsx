import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';
import { Typography, TextField, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  requestContainer: {
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center',
    justify: 'center',
  },
  requestResponse: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: "center",
    justify: "center",
    marginTop: "2%",
  },
}));

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestResponse, setFriendRequestResponse] = useState('');
  let user;
  const classes = useStyles();

  const getFriendRequests = () => {
    axios.get(`/friendRequests/${user}`).then(({ data }) => {
      setFriendRequests(data);
    });
  };

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
    <div className="friend-requests-container">
      <Typography Component="h1" variant="h6" className={classes.requestContainer} id="friend-req-header" >Friend Requests</Typography>
      {friendRequestResponse ? (
        <Typography Component="h1" variant="h6" className={classes.requestResponse} id="request-response">{friendRequestResponse}</Typography>
      ) : null}
      {friendRequests.map((friendRequest) => (
        <div>
          <div>{friendRequest.name}</div>
          <Button
            onClick={responseToFriendRequest.bind(
              this,
              friendRequest._id,
              'Accepted',
            )}
          >
            Accept
          </Button>
          <Button
            onClick={responseToFriendRequest.bind(
              this,
              friendRequest._id,
              'Declined',
            )}
          >
            Decline
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;

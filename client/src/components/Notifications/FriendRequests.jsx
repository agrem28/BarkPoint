import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';
import { Typography, TextField, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const socket = io();

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
  const classes = useStyles();

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

          socket.emit('Accepted')
          setTimeout(() => {
            console.log('set timeout');
            setFriendRequestResponse('');
            getFriendRequests();
          }, 500);
        });
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
              'Accepted'
            )}
          >
            Accept
          </Button>
          <Button
            onClick={responseToFriendRequest.bind(
              this,
              friendRequest._id,
              'Declined'
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

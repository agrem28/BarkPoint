import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendRequests.css';
import { Typography, Button, Grid } from '@material-ui/core';
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
    textAlign: 'center',
    justify: 'center',
    marginTop: '2%',
  },
}));

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestResponse, setFriendRequestResponse] = useState('');
  const classes = useStyles();

  const getFriendRequests = () => {
    axios.get('/session').then(({ data }) => {
      axios.get(`/friendRequests/${data.name}`).then(({ data }) => {
        console.info('WEIRD', data);
        setFriendRequests(data);
      });
    });
  };

  // Refactor code to not use state to get the user.
  // Instead call the "/session" route every time you need it.

  useEffect(() => {
    getFriendRequests();
  }, []);

  const responseToFriendRequest = (id, response) => {
    axios.get('/session').then(({ data }) => {
      axios
        .put('/responseToFriendRequest', { id, user: data.name, response })
        .then(({ data }) => {
          console.info(data, '-----');
          setFriendRequestResponse(data);

          socket.emit('Accepted');

          setTimeout(() => {
            console.info('set timeout');
            setFriendRequestResponse('');
            getFriendRequests();
          }, 500);
        });
    });
  };

  return (
    <div className="friend-requests-container">
      <Typography Component="h1" variant="h6" className={classes.requestContainer} id="friend-req-header">Friend Requests:</Typography>
      {friendRequestResponse ? (
        <Typography Component="h1" variant="h6" className={classes.requestResponse} id="request-response">{friendRequestResponse}</Typography>
      ) : null}
      {friendRequests.map((friendRequest) => (
        <div>
          <Typography Component="h3" variant="h6" className={classes.requestResponse}>{friendRequest.name}</Typography>
          <Grid container direction="row">
            <Button
              id="req-btns"
              justify="center"
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
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;

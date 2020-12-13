import React, { useState } from 'react';
import './Navbar.css';
import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

const useStyles = makeStyles({
  navDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  linkText: {
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: 'white',
    textAlign: 'right',
  },
  avatar: {
    height: '10vh',
    width: '10vh',
    alignSelf: 'left',
  },
});

const navLinks = [
  { title: 'Profile', path: '/profile' },
  { title: 'ToyBox', path: '/toybox' },
  { title: 'BarkPark', path: '/park' },
  { title: 'LogOut', path: '/logout' },
];

const Navbar = () => {
  const classes = useStyles();
  const [userPicture, setUserPicture] = useState('');
  const [userName, setUserName] = useState('');

  const getUserImage = () => {
    axios
      .get('/session')
      .then(({ data }) => {
        setUserPicture(data.picture);
        setUserName(data.given_name);
      })
      .catch((err) => console.warn(err));
  };

  return (
    <AppBar
      style={{
        background: '#0e4749',
        position: 'fixed',
        top: '0',
      }}
      position="static"
    >
      <Toolbar>
        <div>
          <img
            className="avatarLogo"
            src="https://i.ibb.co/zRR5Nd4/barkpoint.png"
            alt=""
          />
        </div>
        {getUserImage()}
        {userPicture ? (
          <div>
            <img id="avatarProfile" src={userPicture} />
          </div>
        ) : null}
        <div id="greeting">
          <Typography component="h1" variant="h5">
            Hey,
            {' '}
            {userName}
            !
          </Typography>
        </div>
        <Container maxWidth="md">
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={classes.navDisplayFlex}
          >
            {navLinks.map(({ title, path }) => (
              <Link to={path} key={title} className={classes.linkText}>
                <ListItem button>
                  <ListItemText primary={title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Container>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;

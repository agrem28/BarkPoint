import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

// const socket = io();

const Sidebar = () => {
  const [notifs, setNotifs] = useState([]);
  const links = [
    { title: 'My Dogs', path: '/profile' },
    { title: 'Friends List', path: '/friendsList' },
    { title: 'Calendar', path: '/calendar' },
  ];

  const getNotifsNumber = () => {
    axios
      .get('/session')
      .then(({ data }) => axios.get(`/data/notifications/${data.email}`))
      .then(({ data }) => {
        console.info('DATA', data.notifs);
        setNotifs(data.notifs);
        if (notifs.length > 0) {
          axios.delete(`/data/notifications/${data.email}`);
        }
      });
  };

  useEffect(() => {
    getNotifsNumber();
  }, []);

  // socket.on('waiting', () => getNotifsNumber());

  return (
    <div
      className="SidebarProfile"
      style={{ position: 'fixed', top: '65px', zIndex: '1' }}
    >
      <List
        component="nav"
        aria-labelledby="side navigation"
        className="sideBarList"
      >
        {links.map((link) => (
          <Link to={link.path} key={link.title}>
            <ListItem button className="sideBarRow">
              <ListItemText primary={link.title} />
            </ListItem>
          </Link>
        ))}
        <Link to="/notifications" key="Notifications" notifs={notifs}>
          <ListItem button className="sideBarRow">
            <ListItemText primary="Notifications" />
            <NotificationsIcon />
            <div
              style={{ color: notifs.length > 0 ? 'red' : '#012626' }}
              onClick={() => console.info(notifs)}
            >
              {' '}
              {notifs.length}{' '}
            </div>
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

export default Sidebar;

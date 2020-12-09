import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

const Sidebar = () => {
  const links = [
    { title: 'My Dogs', path: '/profile' },
    { title: 'Friends List', path: '/friendsList' },
    { title: 'Calendar', path: '/calendar' },
  ];
  return (
    <div className="SidebarProfile">
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
        <Link to="/notifications" key="Notifications">
          <ListItem button className="sideBarRow">
            <ListItemText primary="Notifications" />
            <NotificationsIcon />
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

export default Sidebar;

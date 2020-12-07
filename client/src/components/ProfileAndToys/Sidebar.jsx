import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';

const Sidebar = () => {
  const links = [
    { title: 'Friends List', path: '/friendsList' },
    { title: 'Calendar', path: '/calendar' },
    { title: 'Notifications', path: '/notifications' },
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
            test
          </Link>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;

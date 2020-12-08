import React from 'react';
import ApiCalendar from 'react-google-calendar-api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Calendar = () => {
  const style = {
    position: 'relative',
    left: '500px',
  };
  const handleItemClick = (e, name) => {
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
  };

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <h1>This is your Calender.</h1>
      <button
        style={style}
        type="button"
        onClick={(e) => handleItemClick(e, 'sign-in')}
      >
        sign-in
      </button>
      <button
        style={style}
        type="button"
        onClick={(e) => handleItemClick(e, 'sign-out')}
      >
        sign-out
      </button>
    </div>
  );
};

export default Calendar;

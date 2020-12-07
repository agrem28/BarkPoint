import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Calendar = () => {
  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <h1>This is your Calender.</h1>
    </div>
  );
};

export default Calendar;

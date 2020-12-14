import React, { useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { useLoadScript } from '@react-google-maps/api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {
  Typography, Button, FormControl, InputLabel, OutlinedInput,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import moment from 'moment';
import axios from 'axios';

import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';
import Search from './Search';
import Popup from './Popup';

import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const libraries = ['places'];

const useStyles = makeStyles(() => ({
  alignItemsAndJustifyContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
  },
  calendarHeader: {
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
    marginTop: '5%',
  },
}));

const times = [];
for (let hour = 0; hour < 24; hour += 1) {
  let timeString = '';
  let amOrPm = '';
  if (hour < 12) {
    amOrPm = 'am';
    if (hour === 0) {
      timeString += hour + 12;
    } else {
      timeString += hour;
    }
  } else {
    amOrPm = 'pm';
    if (hour !== 12) {
      timeString += hour - 12;
    } else {
      timeString += hour;
    }
  }
  timeString += ':';
  for (let mins = 0; mins < 60; mins += 15) {
    let minuteString = '';
    if (mins === 0) {
      minuteString = '00';
    } else {
      minuteString = mins;
    }
    const result = timeString + minuteString + amOrPm;
    times.push({ value: result, label: result });
  }
}
const defaultStartTime = () => {
  const currentTime = new Date().toTimeString();
  let hour = currentTime.slice(0, 2);
  const minutes = currentTime.slice(3, 5);
  if (hour < 12) {
    hour = hour === '00' ? '12' : `${Number(hour)}`;
    for (let i = 0; i < times.length / 2; i += 1) {
      const timesHour = times[i].value.length > 6 ? times[i].value.slice(0, 2) : `0${times[i].value[0]}`;
      const timesMinutes = times[i].value.length > 6
        ? times[i].value.slice(3, 5)
        : times[i].value.slice(2, 4);
      if (minutes >= 45) {
        if (times[i].value === `${Number(hour)}:45am`) {
          return i + 1;
        }
      }
      if (hour === timesHour && minutes < timesMinutes) {
        return i;
      }
    }
  } else {
    if (hour !== '12') {
      hour = `${Number(hour) - 12}`;
    }
    for (let i = times.length / 2; i < times.length; i += 1) {
      const timesHour = times[i].value.length > 6 ? times[i].value.slice(0, 2) : times[i].value[0];
      const timesMinutes = times[i].value.length > 6
        ? times[i].value.slice(3, 5)
        : times[i].value.slice(2, 4);
      if (minutes >= 45) {
        if (times[i].value === `${Number(hour)}:45pm`) {
          return i + 1;
        }
      }
      if (hour === timesHour && minutes < timesMinutes) {
        return i;
      }
    }
  }
  return currentTime;
};

const CalendarView = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [sign, setSign] = useState(ApiCalendar.sign);
  const [trigger, setTrigger] = useState(true);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [start, setStart] = useState(times[defaultStartTime()]);
  const [end, setEnd] = useState(times[defaultStartTime() + 4]);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendees, setAttendees] = useState([
    { email: '', displayName: '', responseStatus: 'accepted' },
  ]);
  const [eventLocation, setEventLocation] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({});

  const getEmail = (name = 'self') => {
    if (name === 'self') {
      axios
        .get('/session')
        .then(({ data }) => {
          const placeholder = [...attendees];
          placeholder[0].email = data.email;
          placeholder[0].displayName = data.name;
          setAttendees(placeholder);
          setEmail(data.email);
        })
        .catch();
    } else {
      axios
        .get(`/userEmail/${name}`)
        .then(({ data }) => {
          if (data !== '') {
            const alreadyInvited = attendees.reduce((acc, attendee) => {
              if (attendee.email === data.email) {
                return true;
              }
              return acc;
            }, false);
            if (!alreadyInvited) {
              console.info('fired');
              setAttendees([
                ...attendees,
                {
                  email: data.email,
                  displayName: data.name,
                },
              ]);
            }
          }
        })
        // .then(() => console.info(attendees))
        .catch();
    }
  };

  const removeAttendee = (emailToRemove) => {
    console.info(
      attendees.filter((attendee) => attendee.email !== emailToRemove),
    );
    setAttendees(
      attendees.filter((attendee) => attendee.email !== emailToRemove),
    );
  };

  const parseTime = (time) => {
    const result = [];
    if (time.slice(time.length - 2) === 'am') {
      if (time.slice(0, 2) === '12') {
        result.push(0);
      } else if (time.length > 6) {
        result.push(Number(time.slice(0, 2)));
      } else {
        result.push(Number(time[0]));
      }
    } else if (time.slice(time.length - 2) === 'pm') {
      if (time.slice(0, 2) === '12') {
        result.push(12);
      } else if (time.length > 6) {
        result.push(Number(time.slice(0, 2)) + 12);
      } else {
        result.push(Number(time[0]) + 12);
      }
    }

    if (time.length > 6) {
      result.push(Number(time.slice(3, 5)));
    } else {
      result.push(Number(time.slice(2, 4)));
    }

    return result;
  };

  const createEvent = () => {
    const date = eventDate.toLocaleDateString().split('/');
    const startValues = parseTime(start.value);
    const endValues = parseTime(end.value);
    const event = {
      summary: eventTitle,
      start: {
        dateTime: new Date(
          date[2],
          Number(date[0]) - 1,
          date[1],
          startValues[0],
          startValues[1],
        ),
      },
      end: {
        dateTime: new Date(
          date[2],
          Number(date[0]) - 1,
          date[1],
          endValues[0],
          endValues[1],
        ),
      },
      attendees,
      location: eventLocation,
    };
    // console.info(event);
    ApiCalendar.createEvent(event)
      .then((result) => {
        console.info(result);
        setTrigger(!trigger);
        setShowCreateEventForm(false);
        setEventTitle('');
        setEventDate('');
        setStart(times[defaultStartTime()]);
        setEnd(times[defaultStartTime() + 4]);
        setAttendees([
          { email: '', displayName: '', responseStatus: 'accepted' },
        ]);
      })
      .catch((err) => console.warn(err));
  };

  const getEvents = () => {
    if (ApiCalendar.sign) {
      ApiCalendar.listUpcomingEvents()
        .then(({ result }) => {
          setEvents(
            result.items.map((event) => ({
              title: event.summary,
              start: new Date(event.start.dateTime),
              end: new Date(event.end.dateTime),
              attendees: event.attendees,
              location: event.location,
            })),
          );
        })
        .catch((err) => console.warn(err));
    } else {
      setEvents([]);
    }
  };

  const signInOrOut = (name) => {
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
    setSign(ApiCalendar.sign);
  };

  const predictEndTime = () => {
    if (start.value.slice(start.value.length - 2).toLowerCase() === 'am') {
      for (let i = 0; i < times.length / 2; i += 1) {
        if (start.value === times[i].value) {
          setEnd(times[i + 4]);
        }
      }
    } else {
      for (let i = times.length / 2; i < times.length; i += 1) {
        if (start.value === times[i].value) {
          setEnd(times[i + 4]);
        }
      }
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const currentTime = new Date();
    if (showCreateEventForm) {
      if (
        slotInfo.start > currentTime
        || slotInfo.start.toLocaleDateString() === currentTime.toLocaleDateString()
      ) {
        setEventDate(slotInfo.start);
      }
    }
  };

  const handleSelectEvent = (eventInfo) => {
    setClickedEvent(eventInfo);
    setShowPopup(true);
  };

  useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_KEY,
    libraries,
  });

  useEffect(() => getEvents(), [sign, trigger]);
  useEffect(() => predictEndTime(), [start]);

  return (
    <div className="calendar-wrapper">
      <Navbar />
      <Sidebar />
      <div id="calendar-container">
        <Typography
          Component="h1"
          variant="h2"
          className={classes.calendarHeader}
          id="calendar-header"
        >
          Upcoming Playdates
        </Typography>
        {email === '' ? getEmail() : null}
        {sign ? (
          <Button
            variant="contained"
            color="primary"
            id="link-unlink-btn"
            onClick={() => signInOrOut('sign-out')}
          >
            Unlink Calendar
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            id="link-unlink-btn"
            onClick={() => signInOrOut('sign-in')}
          >
            Link with Your Google Calendar
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          id="google-calendar-btn"
          // style={{ alignSelf: 'center' }}
          onClick={() => setShowCreateEventForm(!showCreateEventForm)}
        >
          Create Event
        </Button>
        <div
          id="calendar"
          // className={classes.alignItemsAndJustifyContent}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, marginRight: 60 }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
          />
          {/* style={{ textAlign: 'center' }} */}
          <div>
            {showCreateEventForm ? (
              <div id="create-event-form">
                <FormControl variant="outlined">
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <OutlinedInput id="title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} label="Name" />
                </FormControl>

                {eventDate !== ''
                  ? (
                    <div>
                      {eventDate.toDateString()}
                    </div>
                  ) : (
                    <Typography>
                      Select a date from the calendar above.
                    </Typography>
                  )}
                <div>
                  <span>
                    <Select
                      variant="filled"
                      value={start}
                      options={times}
                      onChange={(e) => setStart(e)}
                      className="time"
                    />
                    {' - '}
                    <Select
                      color="secondary"
                      value={end}
                      options={times}
                      onChange={(e) => setEnd(e)}
                      className="time"
                    />
                  </span>
                </div>
                <Typography>

                  Attendees:
                </Typography>
                <div>
                  {attendees.map((friend, i) => (
                    <div key={friend} data-email={friend.email}>
                      <Typography>
                        {friend.displayName}

                      </Typography>
                      {i > 0 ? (
                        <Button
                          onClick={(e) => removeAttendee(e.target.parentElement.dataset.email)}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  ))}
                  <input
                    value={attendeeName}
                    placeholder="Who do you want to invite?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        getEmail(attendeeName);
                        setAttendeeName('');
                      }
                    }}
                    onChange={(e) => setAttendeeName(e.target.value)}
                  />
                </div>
                <Search setEventLocation={setEventLocation} />
                {eventLocation !== '' ? <div>{eventLocation}</div> : null}
                <Button
                  id="invite-btn"
                  variant="outlined"
                  color="primary"
                  onClick={createEvent}
                >
                  Invite
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {showPopup ? <Popup event={clickedEvent} setShowPopup={setShowPopup} /> : null}
      </div>
    </div>
  );
};

export default CalendarView;

/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
const { Router } = require('express');
// const axios = require('axios');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const twilio = require('twilio')(accountSid, authToken);

const { Dog, User, Park } = require('../db/models/models');

const dbRouter = Router();
/**
 * Adds a new user into the barkPoint database
 */
dbRouter.post('/data/user', (req, res) => User(req.body)
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  }));
/**
 * Finds all dogs whose user_email field matches the current sessions user's email
 */
dbRouter.get('/data/dog', ({ user }, res) => {
  const { _json } = user;
  Dog.findDogs(_json.email)
    .then((dogs) => {
      if (dogs.length) {
        res.status(200).send(dogs);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Adds a new dog into the barkPoint database.
 *
 * @data is equal to the current sessions user's email
 *
 * @personalitytypes is an array of length 3. It's values are booleans with
 * each value correlating to a personality type. Swiping left equaling false
 * and swiping right equaling false.
 */
dbRouter.post('/data/dog', (req, res) => {
  const {
    size,
    breed,
    number,
    email,
    dogname,
    image,
    personalitytypes,
  } = req.body;
  return Dog.addDog(
    dogname,
    breed,
    size,
    number,
    email,
    image,
    personalitytypes,
  )
    .then(() => {
      // Message.addMsg(dogname, breed, size, number, email, image,
      twilio.messages
        .create({
          body: `Welcome to BarkPoint! ${dogname} has been registered. You will now recieve notifications at this number.`,
          from: '+12678677568',
          statusCallback: 'http://postb.in/1234abcd',
          to: `${number}`,
        })
        .then((message) => res.json(message.sid))
        .catch((err) => console.log('TWILIO ERROR==>', err));
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Changes a dog's number in the barkPoint database.
 *
 *
 */

dbRouter.put('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  console.log(req.body, 'BODY');
  const notif = `BarkPoint subscription number changed to ${req.body.number}.`;
  const newNum = req.body.number;
  console.log(notif, 'NOTIF');
  User.addNotif(email, notif)
    .then(() => Dog.changeNumber(email, newNum)).then(() => {
      twilio.messages
        .create({
          body: 'BarkPoint subscription number changed. You will now recieve notifications at this number.',
          from: '+12678677568',
          statusCallback: 'http://postb.in/1234abcd',
          to: `${newNum}`,
        })
        .then((message) => {
          console.log(message, 'MESSAGE');
          res.send(message);
        })
        .catch((err) => console.log('TWILIO error==>', err));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

dbRouter.get('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  User.User.findOne({ email })
    .then((data) => {
      console.log(data, 'DATA');
      res.send(data);
    });
});

dbRouter.delete('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  User.User.update(
    { email },
    { notifs: [] },
  ).then(() => {
    console.log('NOTIFS DELETED');
    res.send('NOTIFS DELETED');
  });
});

/**
 * Adds a new toy into a the currently selected dog's toy field (an array)
 *
 * @id is equal to the current dog's mongo-provided ObjectId
 * @body is equal to an object with the to be added toy's info (see dog.js in models)
 */
dbRouter.put('/data/dog/:id', (req, res) => {
  const { id } = req.params;
  const { body } = req;
  return Dog.addToy(id, body)
    .then(() => {
      // console.log('aanythinh');
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Removes a toy from the currently selected dog's toy field (an array)
 *
 * @id is equal to the current dog's mongo-provided ObjectId
 * @body is equal to an object with the to be deleted toy's info (see dog.js in models)
 */
dbRouter.delete('/data/toy:id', (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  return Dog.removeToy(id, data)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
/**
 * Removes a dog from the barkPoint database
 *
 * @id is equal to the current dog's mongo-provided ObjectId
 */
dbRouter.delete('/data/dog:id', (req, res) => {
  const { id } = req.params;
  return Dog.deleteDog(id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
dbRouter.get('/data/park', async (req, res) => {
  const allDogs = await Park.getParks();
  console.warn(allDogs);
  res.status(200).send(allDogs);
});
/**
 * Adds a park into the barkPoint database
 */
dbRouter.post('/data/park', (req, res) => {
  const {
    name, lat, long, comments,
  } = req.body;
  return Park.addPark(name, lat, long, comments)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
/**
 * Updates the comment field of the selected park
 *
 * @name is equal to the name field of the park whose comment you wish to update
 */
dbRouter.put('/data/park', (req, res) => {
  const { name, comment } = req.body;
  return Park.updatePark(name, comment)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Wipes the existing favorite park from the user's history.
 * The params include an @id for the user and an @body for the
 * specified park.
 */

dbRouter.put('/data/unfavpark/:email', (req, res) => {
  const { email } = req.params;
  const { body } = req; // you only need the park name
  console.warn('id in db router for park', email);
  console.warn(body);
  return User.unFavPark(email, body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
/**
 * Adds a park into a the current users parks field (an array)
 *
 * @id is equal to the current user's mongo-provided ObjectId
 * @body is equal to an object with the to be added park's info
 */
dbRouter.put('/data/favpark/:email', (req, res) => {
  const { email } = req.params;
  const { body } = req; // you only need the park name
  console.warn('id in db router for park', email);
  return User.favPark(email, body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Below is the getter for favorite parks. This request is made to
 * retrieve the favorite parks from a specific user id @param {string} id .
 *
 * The request outputs the park object data in the form of an @array .
 */
dbRouter.get('/data/favpark', (req, res) => {
  const { id } = req.query;
  User.getFavParks(id)
    .then((parkData) => {
      res.status(200).send(parkData);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
/**
 * Removes a specific park from the barkPoint database based on @name .
 */
dbRouter.delete('/data/park/:id', (req, res) => {
  const { name } = req.params;
  return Park.deletePark(name)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Adds a notification into the current users notifs array
 *
 * @id is equal to the current user's mongo-provided ObjectId
 * @body is equal to an object with the to be added park's info
 */
dbRouter.put('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  const { body } = req;
  console.warn('id in db router for notification', email);
  return User.addNotif(email, body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Below is the getter for notifications. This request is made to
 * retrieve the notifications from a specific user id @param {string} id .
 *
 * The request outputs the notifications object data in the form of an @array .
 */
dbRouter.get('/data/notifications', (req, res) => {
  const { id } = req.query;
  User.getNotifs(id)
    .then((notifData) => {
      res.status(200).send(notifData);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

dbRouter.get('/findUsers', (req, res) => {
  User.User.find().then((users) => {
    res.send(users);
  });
});

// This route will find the user being searched for and add his/her
// id to the current users "friendRequest" array.
dbRouter.get('/findFriend/:friend/:currentUser', (req, res) => {
  const { currentUser } = req.params;
  User.User.findOne({ name: currentUser })
    .then((currentUser) => {
      const { friend } = req.params;
      User.User.findOne({ name: friend })
        .then((friend) => {
          if (!friend.friendRequests.includes(currentUser._id)) {
            User.User.updateOne(
              { _id: friend._id },
              { $push: { friendRequests: currentUser._id } },
            )
              .then(() => res.end())
              .catch();
          }
        })
        .catch();
    })
    .catch();
});

dbRouter.get('/friends/:currentUser', (req, res) => {
  User.User.findOne({ name: req.params.currentUser }).then((currentUser) => {
    User.User.find()
      .where('_id')
      .in(currentUser.friends)
      .exec((err, friends) => {
        if (err) {
          console.log(err);
        } else {
          res.send(friends);
        }
      });
  });
});

// To be deleted
dbRouter.get('/addUser', (req, res) => {
  User.User.create({
    name: 'Best User Ever',
    email: 'fakeuser2@gmail.com',
    friends: [],
    friendRequests: [],
    parks: [],
  }).then(() => res.send('User Added'));
});

// To be deleted
dbRouter.get('/deleteUser', () => {
  User.User.remove({ name: 'Fake User 1' }).then(() => console.log('Successfully deleted.'));
});

// To be deleted
dbRouter.get('/myFriends', () => {
  User.User.update(
    { _id: '5fd025f037590d281d0bf55e' },
    { $push: { friends: '5fd0265137590d281d0bf560' } },
  ).then(() => console.log('FRIEND ADDED'));
});
module.exports = dbRouter;

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
dbRouter.post('/data/user', (req, res) =>
  User(req.body)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    })
);
/**
 * Finds all dogs whose user_email field matches the current sessions user's email
 */
dbRouter.get('/data/dog', ({ cookies }, res) => {
  // const { _json } = user;
  Dog.findDogs(cookies.Barkpark._json.email)
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
    personalitytypes
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
        .catch((err) => console.error('TWILIO ERROR==>', err));
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
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
  const { name, lat, long, comments } = req.body;
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
 * Below is the getter for notifications. This request is made to
 * retrieve the notifications from a specific user id @param {string} id .
 *
 * The request outputs the notifications object data in the form of an @array .
 */
// dbRouter.get('/data/notifications', (req, res) => {
//   const { id } = req.query;
//   User.getNotifs(id)
//     .then((notifData) => {
//       res.status(200).send(notifData);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// });

/**
 * Adds a notification into the current users notifs array
 *
 * @id is equal to the current user's mongo-provided ObjectId
 * @body is equal to an object with the to be added park's info
 */
// dbRouter.put('/data/notifications/:email', (req, res) => {
//   const { email } = req.params;
//   const { body } = req;
//   console.warn('id in db router for notification', email);
//   return User.addNotif(email, body)
//     .then(() => {
//       res.sendStatus(200);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// });

// changes a dog's number in the barkPoint database and adds a notification to their user's notifs array
dbRouter.put('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  const notif = `BarkPoint subscription number changed to ${req.body.number}.`;
  const newNum = req.body.number;
  User.addNotif(email, notif)
    .then(() => Dog.changeNumber(email, newNum))
    .then(() => {
      twilio.messages
        .create({
          body:
            'BarkPoint subscription number changed. You will now recieve notifications at this number.',
          from: '+12678677568',
          statusCallback: 'http://postb.in/1234abcd',
          to: `${newNum}`,
        })
        .then((message) => {
          res.send(message);
        })
        .catch((err) => console.err(err));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// gets the user's notifications array based on user's email
dbRouter.get('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  User.User.findOne({ email }).then((data) => {
    res.send(data);
  });
});

// empties the user's notifications array, based on user's email
dbRouter.delete('/data/notifications/:email', (req, res) => {
  const { email } = req.params;
  User.User.update({ email }, { notifs: [] }).then(() => {
    res.send('NOTIFS DELETED');
  });
});

dbRouter.get('/findUsers', (req, res) => {
  User.User.find().then((users) => {
    res.send(users);
  });
});


/*  This route will update a user's messages array when that user sends
    another user a message, send text notifications to the recipient user, and update the recipient user's
*   notification's array
*/
dbRouter.post('/messages/:currentUser', (req, res) => {
  const notif = `BarkPoint user messaged you.`;
  User.User.findOne({ email: req.params.currentUser })
    .then((data) => {
      const newMessage = data.messages;
      if (newMessage[req.body.to]) {
        newMessage[req.body.to].push(req.body.message);
      } else {
        newMessage[req.body.to] = [req.body.message];
      }
      // updates sender's messages
      User.User.updateOne({ email: req.params.currentUser }, { messages: newMessage })
        .then(() => {
          User.User.findOne({ email: req.body.user })
            .then((result) => {
              const newMessage2 = result.messages;
              if (newMessage2[req.body.from]) {
                newMessage2[req.body.from].push(req.body.message);
              } else {
                newMessage2[req.body.from] = [req.body.message];
              }
              // updates receiver's messages
              return User.User.updateOne({ email: req.body.user }, { messages: newMessage2 })
                .then((data) => res.send(data));
            });
        }).then(() => {
          Dog.findDogs(req.body.user)
            .then((result) => {
              User.addNotif(req.body.user, notif).then(() => {
                twilio.messages
                  .create({
                    body: 'BarkPoint user messaged you.',
                    from: '+12678677568',
                    statusCallback: 'http://postb.in/1234abcd',
                    to: result[0].number,
                  })
                  .then((message) => {
                    res.send(message);
                  })
                  .catch((err) => console.err(err));
              });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    });
});

/*  This route will find the user being searched for and add his/her
*   id to the current users "friendRequest" array, send a text notification to that user, and update that user's
*   notification's array
*/

dbRouter.get('/userEmail/:name', (req, res) => {
  const { name } = req.params;
  User.User.findOne({ name })
    .then((user) => res.send(user))
    .catch();
});

// This route will find the user being searched for and add his/her
// id to the current users "friendRequest" array.

dbRouter.get('/findFriend/:friend/:currentUser', (req, res) => {
  const notif = 'BarkPoint user has sent a friend request.'
  const { currentUser } = req.params;
  User.User.findOne({ name: currentUser })
    .then((currentUser) => {
      const { friend } = req.params;
      User.User.findOne({ name: friend })
        .then((friend) => {
          if (
            !friend.friendRequests.includes(currentUser._id) &&
            !friend.friends.includes(currentUser._id)
          ) {
            User.User.updateOne(
              { _id: friend._id },
              { $push: { friendRequests: String(currentUser._id) } },
            )
              .then(() => res.end())
              .catch((err) => {
                console.warn(err);
              });
          }
        }).then(() => {
          User.User.findOne({ name: req.params.friend })
          .then((recipient) => {
            User.addNotif(recipient.email, notif).then(()=>{
              Dog.findDogs(recipient.email)
              .then((dog) => {
                  twilio.messages
                    .create({
                      body: 'BarkPoint user has sent you a friend request.',
                      from: '+12678677568',
                      statusCallback: 'http://postb.in/1234abcd',
                      to: dog[0].number,
                    })
                    .then((message) => {
                      res.send(message);
                    })
                    .catch((err) => console.err(err));
              })
            })
          })
        }).catch((err) => console.err(err));
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

dbRouter.get('/friends/:currentUser', (req, res) => {
  User.User.findOne({ name: req.params.currentUser }).then((currentUser) => {
    User.User.find()
      .where('_id')
      .in(currentUser.friends)
      .exec((err, friends) => {
        if (err) {
          console.warn(err);
        } else {
          res.send(friends);
        }
      });
  });
});

dbRouter.get('/friendRequests/:user', (req, res) => {
  const { user } = req.params;

  User.User.findOne({ name: user }, 'friendRequests').then(
    ({ friendRequests }) => {
      User.User.find()
        .where('_id')
        .in(friendRequests)
        .exec((err, friendRequests) => {
          if (err) {
            console.warn(err);
          } else {
            res.send(friendRequests);
          }
        });
    }
  );
});

dbRouter.put('/responseToFriendRequest', (req, res) => {
  notif = 'BarkPoint user has accepted your friend request.';
  const userId = req.body.id;
  const currentUser = req.body.user;
  const { response } = req.body;
  User.User.findOneAndUpdate(
    { name: currentUser },
    { $pull: { friendRequests: userId } },
    { multi: true }
  )
    .then(() => {
      if (response === 'Accepted') {
        User.User.findOneAndUpdate(
          { name: currentUser },
          { $push: { friends: String(userId) } }
          ).then((data) => {
            console.log(data._id, 'DATAHDIHDHE')
          User.User.findOneAndUpdate(
            { _id: userId },
            { $push: { friends: String(data._id) } },
          ).then((data) => {
            console.log(data)
            User.addNotif(data.email, notif).then(()=>{
              Dog.findDogs(data.email)
              .then((result) => {
                 User.User.addNotif(data.email, notif).then(() => {
                  twilio.messages
                    .create({
                      body: 'BarkPoint user has accepted your friend request.',
                      from: '+12678677568',
                      statusCallback: 'http://postb.in/1234abcd',
                      to: result[0].number,
                    })
                    .then((message) => {
                      res.send(data.friendRequests);
                    })
                    .catch((err) => console.err(err));
                 });
              })
            })
          });
        });
      } else {
        res.send(`Friend Request ${response}`);
      }
    })
    .catch((err) => console.warn(err));
});

//Unfriend user
dbRouter.put('/unfriend', (req, res) => {
  const friendID = req.body.id;
  const currentUser = req.body.user;
  User.User.findOneAndUpdate(
    { name: currentUser },
    { $pull: { friends: friendID } }
  ).then((user) => {
    User.User.findOneAndUpdate(
      { _id: friendID },
      { $pull: { friends: String(user._id) } }
    ).then(() => {
      res.send(user);
    });
  });
});

// // // To be deleted
// dbRouter.get('/addUser', (req, res) => {
//   User.User.create({
//     name: 'Look at the new guy!',
//     email: 'fakeuser2@gmail.com',
//     friends: [],
//     friendRequests: [],
//     parks: [],
//   }).then(() => res.send('User Added'));
// });


// // // To be deleted - deletes a user from the database...hardcoded.
// // dbRouter.get('/deleteUser', () => {
// //   User.User.remove({ name: 'Fake User 1' }).then(() =>
// //     console.log('Successfully deleted.')
// //   );
// // });

// //To be deleted - will remove a friend from your friends list...hardcoded.
// dbRouter.get('/removeFriend', (req, res) => {
//   User.User.updateOne(
//     { _id: '5fd2920e359cca2868eb686e' },
//     { $pull: { friends: '5fd28a829e01adc94f1c96a1' } }
//   ).then(() => res.send('Successfully deleted.'));
// });

// //To be deleted - will remove a user from your friend requests list...hardcoded.
// dbRouter.get('/removeFriendRequest', (req, res) => {
//   User.User.updateOne(
//     { _id: '5fd2c2d0a98722e8c8a2600d' },
//     { $pull: { friendRequests: '5fd28a829e01adc94f1c96a1' } }
//   ).then(() => res.send('Successfully removed friend request.'));
// });

// // To be deleted - will add a friend to your friends list...hardcoded.
// dbRouter.get('/addFriend', (req, res) => {
//   User.User.update(
//     { _id: '5fd28a829e01adc94f1c96a1' },
//     { $push: { friends: '5fd28f1dcc09ef1efc1e92e3' } }
//   ).then(() => res.send('FRIEND ADDED'));
// });

// // //To be deleted - will add a user to your friend request list...hardcoded.
// dbRouter.get('/addFriendRequest', (req, res) => {
//   User.User.updateOne(
//     { _id: '5fd28a829e01adc94f1c96a1' },
//     {
//       $push: {
//         friendRequests: '5fd2a3bc0955a22d0734cb76',
//       },
//     }
//   ).then(() => res.send('Successfully added friend request.'));
// });

dbRouter.get('/messages/:currentUser', (req, res) => {
  User.User.findOne({ email: req.params.currentUser }).then((currentUser) =>
    res.send(currentUser.messages)
  );
});

dbRouter.post('/messages/:currentUser', (req, res) => {
  const notif = `${req.body.to} user messaged you.`;
  User.User.findOne({ email: req.params.currentUser }).then((data) => {
    const newMessage = data.messages;
    if (newMessage[req.body.to]) {
      newMessage[req.body.to].push(req.body.message);
    } else {
      newMessage[req.body.to] = [req.body.message];
    }
    // updates sender's messages
    User.User.updateOne(
      { email: req.params.currentUser },
      { messages: newMessage }
    )
      .then(() => {
        User.User.findOne({ email: req.body.user }).then((result) => {
          const newMessage2 = result.messages;
          if (newMessage2[req.body.from]) {
            newMessage2[req.body.from].push(req.body.message);
          } else {
            newMessage2[req.body.from] = [req.body.message];
          }
          // updates receiver's messages
          return User.User.updateOne(
            { email: req.body.user },
            { messages: newMessage2 }
          ).then((data) => res.send(data));
        });
      })
      .then(() => {
        Dog.findDogs(req.body.user)
          .then((result) => {
            User.addNotif(req.body.user, notif).then(() => {
              twilio.messages
                .create({
                  body: 'BarkPoint user messaged you.',
                  from: '+12678677568',
                  statusCallback: 'http://postb.in/1234abcd',
                  to: result[0].number,
                })
                .then((message) => {
                  res.send(message);
                })
                .catch((err) => console.err(err));
            });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  });
});

module.exports = dbRouter;

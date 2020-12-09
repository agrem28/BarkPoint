const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: String,
  name: String,
  friends: Array,
  friendRequests: Array,
  messages: {},
  parks: [],
  notifs: [],
});
const User = model('User', userSchema);
/**
 * The parks [] is an array of names of parks that this user has liked
 *
 * Lines 20-22 check to see if that user already exists.
 */
const createUser = (body) => {
  const user = new User({
    email: body.email,
    name: body.name,
    friends: [],
    messages: { test: '' },
    friendRequests: [],
    parks: [],
    notifs: [],
  });
  const { email } = user;
  return User.findOne({ email }).then((result) => {
    if (!result) {
      return User.create(user);
    }
    return '';
  });
};
const findUser = (email) => User.findOne({ email }).exec();
const findAllUsers = () => User.find().exec();

/**
 * @param {ObjectId} userId -- the mongo-provided ObjectId
 * @param {string} park -- the name value of the park a user wishes to favorite
 *
 * $addToSet and $pull are built in mongo methods for fields that have an array as the value.
 *
 * $addToSet will add the value provided into an array if it doesn't already exist there.
 * $pull will remove the value provided from an array if it exists there.
 */
const favPark = (email, park) => User.findOneAndUpdate({ email }, { $addToSet: { parks: park } });
const unFavPark = (email, park) => User.findOneAndUpdate({ email }, { $pull: { parks: park } });
const getFavParks = (email) => User.findOne({ email })
  .then((userData) => (userData.parks ? userData.parks : []))
  .catch((err) => console.error(err));

const addNotif = (email, notif) => User.findOneAndUpdate(
  { email },
  { $addToSet: { notifs: notif } },
);
const deleteNotif = (email, notif) => User.findOneAndUpdate(
  { email },
  { $pull: { notifs: notif } },
);
const getNotifs = (email) => User.findOne({ email })
  .then((userData) => (userData.notifs ? userData.notifs : []))
  .catch((err) => console.error(err));

module.exports = {
  createUser,
  findUser,
  favPark,
  unFavPark,
  getFavParks,
  addNotif,
  deleteNotif,
  getNotifs,
  findAllUsers,
  User,
};

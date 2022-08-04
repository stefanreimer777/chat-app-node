const users = [];

// Join user to chat by adding a user to the array and return it
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// Get current user (by id)
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  // remove user from users-array and get the index
  const index = users.findIndex((user) => user.id === id);
  //if it finds it returns it if not it returns -1
  if (index !== -1) {
    // return users-array without that user [0]
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getRoomUsers = (room) => {
  //return only if user-room is equal to room that is passed in
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};

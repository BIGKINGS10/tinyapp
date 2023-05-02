const getUserByEmail = (email, userList) => {
  for (let key in userList) {
    if (email === userList[key]["email"]) {
      return userList[key];
      }
  }
};

module.exports = {
  getUserByEmail
}
const getUserByEmail = (email, userList) => {
  for (let key in userList) {
    if (email === userList[key]["email"]) {
      return userList[key];
      }
  }
};

const findShortUrl = (shortUrl, urlDatabase) => {
  for (let key in urlDatabase) {
  if (shortUrl === key) {
    return true;
    }
  }
}


const urlsForUser = function(id, urlDatabase) {
  let userURLs = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key]["userID"] === id) {
      userURLs[key] = urlDatabase[key];
    }
  }
  return userURLs;
};

module.exports = {
  getUserByEmail, findShortUrl, urlsForUser
}
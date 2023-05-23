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
};


const urlsForUser = function(id, urlDatabase) {
  let userURLs = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key]["userID"] === id) {
      userURLs[key] = urlDatabase[key];
    }
  }
  return userURLs;
};

const getDate = function() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let dateFormat = `${months[month]} / ${day} / ${year}`;
  return dateFormat;
};

const increaseVisitCounts = function(id, users, urlDatabase, shortURL) {
  if (users[id].visited.includes(shortURL)) {
    urlDatabase[shortURL]["visits"] += 1;
  } else {
    urlDatabase[shortURL]["visits"] += 1;
    urlDatabase[shortURL]["uniqueVisits"] += 1;
    users[id].visited.push(shortURL);
  }
};

const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 5) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

module.exports = {
  getUserByEmail, findShortUrl, urlsForUser, getDate, increaseVisitCounts, generateRandomString
};
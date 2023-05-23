const express = require("express");
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const { getUserByEmail, findShortUrl, urlsForUser, getDate, increaseVisitCounts, generateRandomString } = require("./helper_functions/allfunctions");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080

//constants
const { urlDatabase, users, anonymous } = require('./constants');

app.set("view engine", "ejs");
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['firstKey'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));




app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // if(!res.cookie['user_id']){
  if (!req.session.userId) {
    res.status(400).send("You have to be logged to see the list of Short URLs.");
  }

  console.log(users[req.session.user_id]);
  let myUrls = urlsForUser(req.session.userId, urlDatabase);
  const templateVars = {
    urls: myUrls,
    user: users[req.session.userId]
  };
  
   
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("You have to be logged in to generate Short Url.");
  }
  console.log(req.body.longURL); // Log the POST request body to the console
  console.log(generateRandomString());
  let shortUrl = generateRandomString();
  let date = getDate();
  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userID: req.session.userId,
    creationDate: date,
    visits: 0,
    uniqueVisits: 0
  };
  console.log(urlDatabase[shortUrl].longURL);
  res.redirect('/urls');

});

app.get("/urls/new", (req, res) => {
  if (!req.session.userId) {
    res.redirect('/login');
  }
  const templateVars = {
    user: users[req.session.userId]
  };
  res.render("urls_new", templateVars);
});

  
// app.get("/urls/:id", (req, res) => {
app.put("/urls/:id/edit", (req, res) => {
  if (!findShortUrl(req.params.id, urlDatabase)) {
    res.status(400).send("The provided ShortURL does not exists.");
  } else {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      user: users[req.session.userId]
    };
    res.render("urls_show", templateVars);
  }

    


});

app.post("/urls/:id", (req, res) => {
  // const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  urlDatabase[req.params.id]['longURL'] = req.body.newLongUrl;
  res.redirect(`http://localhost:8080/urls`);
});


app.get("/u/:id", (req, res) => {
  if (!findShortUrl(req.params.id, urlDatabase)) {
    res.status(400).send("The provided ShortURL does not exists.");
  } else {
      
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);

}
    
});

app.delete("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`http://localhost:8080/urls`);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  if (!req.session.userId) {
    const email = req.body.email;
    if (req.body.email === "" || req.body.password === "") {
      res.status(400).send("Cannot leave fields empty");
    } else {
      let user = getUserByEmail(email, users);
      console.log(email);
      console.log(users);
      if (!user) {
        res.status(403).send("User Not Found");
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          req.session.userId = user.id;
          res.redirect("/urls/new");
              
        } else {
          res.status(403).send("Email or Password does not match records");
        }
      }
    }

  } else {
    res.redirect("/urls");
  }
    
});



app.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/login");

});

app.get("/register", (req, res) => {
  res.render('urls_register');
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  req.session.userId = id;
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.status(400).send("Invalid email and/or password");
  }

  let user = getUserByEmail(email, users);
  console.log("The user is found", user);
  if (user) {
    res.status(400).send("The provided email address has been previously registered. Use a new one");
  }
  if (!user) {
    users[id] = {
      "id": id,
      "email": email,
      "password": bcrypt.hashSync(password, 10),
      "visited": []
  
    };
    console.log(users);
    res.redirect('/urls');
  }
   
   
   
});
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

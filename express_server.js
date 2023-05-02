const express = require("express");
const { getUserByEmail } = require("./helper_functions/allfunctions")
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser);

function generateRandomString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}




const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


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
      const templateVars = { 
        urls: urlDatabase,
        user: users[res.cookie['user_id']]
      };
  
   
    res.render("urls_index", templateVars);
  });

  app.post("/urls", (req, res) => {
    console.log(req.body.longURL); // Log the POST request body to the console
    console.log(generateRandomString());
    shortUrl = generateRandomString();
    urlDatabase[shortUrl] = req.body.longURL;
    res.redirect(`http://localhost:8080/urls/${shortUrl}`)
  });

  app.get("/urls/new", (req, res) => {
    const templateVars = { 
      user: users[res.cookie['user_id']]
    };
    res.render("urls_new", templateVars);
  });

  
app.get("/urls/:id", (req, res) => {
    const templateVars = { 
      id: req.params.id, 
      longURL: urlDatabase[req.params.id], 
      user: users[res.cookie['user_id']]
    };
    res.render("urls_show", templateVars);
  });

  app.post("/urls/:id", (req, res) => {
    // const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    urlDatabase[req.params.id] = req.body.newLongUrl;
    res.redirect(`http://localhost:8080/urls`)
  });


  app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id];
    res.redirect(longURL);
  });


  app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect(`http://localhost:8080/urls`)
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send("Cannot leave fields empty");
    } else {
        let user = getUserByEmail(email, users);
        console.log(email);
        console.log(users);
        if (!user) {
            res.status(403).send("User Not Found");
        } else {
            if (password !== user.password) {
                res.status(403).send("Email or Password does not match records");
            } else {
                // res.cookie('user_id', user.id)
                res.cookie['user_id'] = user.id;
                res.redirect("/urls/new");
            }
        }
    }
});



  app.post("/logout", (req, res) => {
    res.cookie['user_id'] = null;
    res.redirect("/login");

  });

  app.get("/register", (req, res) => {
    res.render('urls_register');
  })

  app.post("/register", (req, res) => {
    id = generateRandomString();
    res.cookie['user_id'] = id;
    email = req.body.email;
    password = req.body.password;
    if (email === "" || password === "") {
      res.status(400).send("Invalid email and/or password");
    }

    let user = getUserByEmail(email, users);
    console.log("The user is found", user);
    if(user){
      res.status(400).send("The provided email address has been previously registered. Use a new one");
    } 
    if(!user){
      users[id] = {
        "id": id,
        "email": email,
        "password": password
  
      };
      console.log(users);
      res.redirect('/urls');
    }
   
   
   
  })
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

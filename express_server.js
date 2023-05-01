const express = require("express");
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
        username: res.cookie['username']
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
      username: res.cookie['username']
    };
    res.render("urls_new", templateVars);
  });

  
app.get("/urls/:id", (req, res) => {
    const templateVars = { 
      id: req.params.id, 
      longURL: urlDatabase[req.params.id], 
      username: res.cookie['username'] 
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

  app.post("/login", (req, res) => {
    res.cookie['username'] = req.body.username;
    res.redirect("/urls");

  });

  app.post("/logout", (req, res) => {
    res.cookie['username'] = null;
    res.redirect("/urls");

  });
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

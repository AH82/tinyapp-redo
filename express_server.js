const {
  users,
  urlDatabase
} = require("./databases.js");

const {
  generateRandomString
} = require("./helper.js");

const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ["shshSerr"],/* secret keys */

  // Cookie Options
  maxAge: 2 * 24 * 60 * 60 * 1000 // 48 hours
}));




/**
 * Get a user by their email, from the users object.
 * @param {string} email - string
 *
 * @param {object} [usersObject=users] - Users-list Object to be searched through. Defaults to users oject in this code.
    * @param {object} usersObject.userID - indiviual user object with their id as the property-key
      * @param {string} usersObject.userID.id - user's ID
      * @param {string} usersObject.userID.email - user's email
      * @param {string} usersObject.userID.password - users's password
 *
 * @returns {null|object[userID]}
 *  - returns null if not found, or,
 *  - returns individual user object if found.
 */
const getUserByEmail = (email, usersObject = users) => {
  for (let user in usersObject) {
    if (usersObject[user]["email"] === email) return usersObject[user];
  }
  return null;
};

// MINI_TEST : for getUserByEmail() fn
// console.log("TESTING ... getUserByEmail(...)\n");
// console.log("getUserByEmail -> user2 = ", getUserByEmail("user2@example.com"));
// console.log("getUserByEmail -> non-existing user = ", getUserByEmail("user3@example.com"));



const urlsForUser = function(id, databaseObject = urlDatabase) {
  let urlDatabaseForUser = {};
  for (let shortURLID in databaseObject) {
    if (databaseObject[shortURLID].userID === id) {
      urlDatabaseForUser[shortURLID] = databaseObject[shortURLID];
    }
  }
  return urlDatabaseForUser;
};

app.get("/", (req, res) => {
  res.send("hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// URLS ROUTES / ENDPOINTS
app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  if (!userID) {
    res.status(403).send(`
      Status 403: Forbidden 
      you must Login or Register to view URLs
      \n`).end();
  } else {

    const templateVars = {
      userID,
      users,
      urls : urlsForUser(userID)
    };
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {

  if (!req.session["user_id"]) {

    res.status(403).send(`
      Status 403: Forbidden 
      you must Login or Register to create short URLs
      \n`).end();

    /* TEST IT in TERMINAL :
     * curl -X POST -d "longURL=http://www.lighthouselabs.com" localhost:8080/urls
     */

  } else {
    const generatedIDForURL = generateRandomString();
    urlDatabase[`${generatedIDForURL}`] = {};
    urlDatabase[`${generatedIDForURL}`]["longURL"] = req.body.longURL;
    urlDatabase[`${generatedIDForURL}`]["userID"] = req.session["user_id"];
    res.redirect(`/urls/${generatedIDForURL}`);
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID : req.session["user_id"],
    users
  };
  // isUserLoggedIn?
  templateVars.userID ? res.render("urls_new", templateVars) : res.redirect("/login");
});

app.get("/urls/:id", (req, res) => {
  
  const userID = req.session["user_id"];
  const shortURLID = req.params.id;

  if (!userID) {
    res.status(403).send(`
      Status 403: Forbidden 
      You must log in to access urls.
      \n`).end();
  } else if (!urlDatabase[shortURLID]) {
    res.status(404).send(`
        Status 404 : URL does not exist.
        \n`).end();
  } else if (userID !== urlDatabase[shortURLID]["userID"]) {
    res.status(403).send(`
      Status 403: Forbidden 
      You do not have access to this URL
      \n`).end();
      
  } else {

    const templateVars = {
      userID,
      users,
      id: shortURLID,
      longURL : urlDatabase[shortURLID]["longURL"]
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]["longURL"];
  longURL ? res.redirect(longURL) : res
    .status(404)
    .send("Status 404 : URL ID does not exist.");
});

// EDIT ROUTE
app.post("/urls/:id/edit", (req, res) => {
  
  const userID = req.session["user_id"];
  const shortURLID = req.params.id;

  if (!userID) {
    res.status(403).send(`
      Status 403: Forbidden 
      You must log in to access urls.
      \n`).end();
  } else if (!urlDatabase[shortURLID]) {
    res.status(404).send(`
        Status 404 : URL does not exist.
        \n`).end();
  } else if (userID !== urlDatabase[shortURLID]["userID"]) {
    res.status(403).send(`
      Status 403: Forbidden 
      You do not have access to this URL
      \n`).end();
      
  } else {

    urlDatabase[shortURLID]["longURL"] = req.body.edit_LongURL;
    res.redirect("/urls");
  }
});

// DELETE ROUTE
app.post("/urls/:id/delete", (req, res) => {

  const userID = req.session["user_id"];
  const shortURLID = req.params.id;

  if (!userID) {
    res.status(403).send(`
      Status 403: Forbidden 
      You must log in to access urls.
      \n`).end();
  } else if (!urlDatabase[shortURLID]) {
    res.status(404).send(`
        Status 404 : URL does not exist.
        \n`).end();
  } else if (userID !== urlDatabase[shortURLID]["userID"]) {
    res.status(403).send(`
      Status 403: Forbidden 
      You do not have access to this URL
      \n`).end();
      
  } else {

    delete urlDatabase[shortURLID];
    res.redirect("/urls");
  }
});

// USER REGISTRATION
app.get("/register", (req, res) => {
  const templateVars = {
    userID : req.session["user_id"],
    users
  };
  // isUserLoggedIn?
  templateVars.userID ? res.redirect("urls") : res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    /* Validation check => user email or password cannot be empty */
    res.status(400).send('Bad Request: Status 400 : email or pass are empty');
  } else if (getUserByEmail(req.body.email)) {
    /* Validation check => user email canot be already register*/
    res.status(400).send('Bad Request: Status 400 : user email already exists');
  } else {
    /* route logic */
    const generatedUserID = generateRandomString();
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    users[`${generatedUserID}`] = {
      id : generatedUserID,
      email: req.body.email,
      password: hashedPassword
    };
    console.log('POST registration user Object =\n', users); //clg temp
    req.session["user_id"] = generatedUserID;
    res.redirect("/urls");
  }
});

// USER LOGIN
app.get("/login", (req, res) => {
  const templateVars = {
    userID : req.session["user_id"],
    users
  };
  // isUserLoggedIn?
  templateVars.userID ? res.redirect("urls") : res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const existingUser = getUserByEmail(req.body.email);
  if (!req.body.email || !req.body.password) {
    /* Validation check => user email or password cannot be empty */
    res.status(400).send('Bad Request: Status 400 : email or pass are empty');
  } else if (!existingUser) {
    /* Validation check => user email canot be already register*/
    res.status(400).send('Bad Request: Status 400 : user email Not Found');
  } else if (!bcrypt.compareSync(req.body.password, existingUser.password)) {
    /* Validation check => correct password*/
    res.status(403).send('Bad Request: Status 403 : Forbidden : incorrect password');
  } else {
    req.session["user_id"] = existingUser.id;
    res.redirect("/urls");
  }
});

// USER LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
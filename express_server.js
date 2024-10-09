const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * generates random strings for "unique" IDs.
 * @param {number} strLength Desired String Length. Default = 6.
 * @returns {string} generated random string.
 */
const generateRandomString = function(strLength = 6) {

  if (typeof(strLength) !== "number")
    throw new TypeError("Argument must be of type Number");

  let randomString = "";

  //alphanumeric possibilities
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  + "abcdefghijklmnopqrstuvwxyz" + "0123456789";
   
  /* random # between 0-1, multiplied by the number of possible characters,
     rounded then character at this position, then pushed into the string. */
  for (let i = 0; i < strLength; i++)
    randomString += charPool.charAt(Math.floor(Math.random() * charPool.length));
   
  return randomString;
};

// MINI_TEST : for generateRandomString() fn
/* // HAPPY PATH TEST
console.log(
  "Test: random string is => ",
  generateRandomString()
); */
/*
// NEGATIVE-TEST :
console.log(
  "Test: random string is => ",
  generateRandomString("true")
); */

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

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  const templateVars = {
    userID : req.cookies["user_id"],
    users,
    urls : urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log("req.body : \n", req.body);

  const generatedIDForURL = generateRandomString();
  urlDatabase[`${generatedIDForURL}`] = req.body.longURL;

  // res.send("OK Tamam ya Basha");
  res.redirect(`/urls/${generatedIDForURL}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID : req.cookies["user_id"],
    users
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    userID : req.cookies["user_id"],
    users,
    id: req.params.id,
    longURL : urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// EDIT ROUTE
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.edit_LongURL;
  res.redirect("/urls");
});

// DELETE ROUTE
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// USER REGISTRATION
app.get("/register", (req, res) => {
  const templateVars = {
    userID : req.cookies["user_id"],
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
    users[`${generatedUserID}`] = {
      id : generatedUserID,
      email: req.body.email,
      password: req.body.password
    };
    console.log('POST registration user Object =\n', users); //clg temp
    res.cookie("user_id", generatedUserID);
    res.redirect("/urls");
  }
});

// USER LOGIN
app.get("/login", (req, res) => {
  const templateVars = {
    userID : req.cookies["user_id"],
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
  } else if (existingUser.password !== req.body.password) {
    /* Validation check => correct password*/
    res.status(403).send('Bad Request: Status 403 : Forbidden : incorrect password');
  } else {
    res.cookie("user_id", existingUser.id);
    res.redirect("/urls");
  }
});

// USER LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
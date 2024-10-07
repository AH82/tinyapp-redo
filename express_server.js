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

app.get("/urls", (req, res) => {
  const templateVars = {
    username : req.cookies["username"],
    urls : urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log("req.body : \n", req.body);

  const generated_URL_ID = generateRandomString();
  urlDatabase[`${generated_URL_ID}`] = req.body.longURL;

  // res.send("OK Tamam ya Basha");
  res.redirect(`/urls/${generated_URL_ID}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username : req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username : req.cookies["username"],
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

// LOGIN
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
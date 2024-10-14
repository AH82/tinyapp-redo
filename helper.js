/**
 * @file Helper functions
 */

/**
 * import databases used as default params in some helper functions
 */
const {
  users,
  urlDatabase
} = require("./databases.js");

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


/**
 * fetches urls associated with certain user.
 * @typedef {import("./databases.js").UsersDatabaseObject} UsersDatabaseObject
 *
 * @param {*} id - selected user ID
 * @param {UsersDatabaseObject} databaseObject - database to look into, defaults to @see import("./databases.js").UsersDatabaseObject{}
 * @returns {UsersDatabaseObject} - database filtered by selected user.
 */
const urlsForUser = function(id, databaseObject = urlDatabase) {
  let urlDatabaseForUser = {};
  for (let shortURLID in databaseObject) {
    if (databaseObject[shortURLID].userID === id) {
      urlDatabaseForUser[shortURLID] = databaseObject[shortURLID];
    }
  }
  return urlDatabaseForUser;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};
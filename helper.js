/**
 * @file Helper functions
 */

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

module.exports = {
  generateRandomString,
};
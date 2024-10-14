const { assert } = require('chai');

const {
  getUserByEmail,
  generateRandomString,
  urlsForUser
} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  b2xVn3: {
    longURL: "http://www.metro.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

  describe("generateRandomString", () => {
    it("should generate a 6 digit id by default if argument is empty or =undefined", () => {
      const id = generateRandomString();
      assert(id.length === 6);
    });
    it("should throw an error if argument is not of type Number", () => {
      expect(() => generateRandomString(true)).to.throw();
      expect(() => generateRandomString("string")).to.throw();
      expect(() => generateRandomString(null)).to.throw();
      expect(() => generateRandomString({})).to.throw();
    });
    it("Should generate ID length according to argument's number", () => {
      const id2 = generateRandomString(2);
      const id4 = generateRandomString(4);
      const id6 = generateRandomString(6);
      const id9 = generateRandomString(9);
      assert(id2.length === 2);
      assert(id4.length === 4);
      assert(id6.length === 6);
      assert(id9.length === 9);
    });
    it("should throw an error if arg = 0 or negative", () => {
      expect(() => generateRandomString(0)).to.throw();
      expect(() => generateRandomString(-1)).to.throw();
      
    });
  });
  
  describe('getUserByEmail', function() {
    it('should return a user with valid email', function() {
      const user = getUserByEmail("user@example.com", testUsers);
      const expectedUserID = "userRandomID";
      assert(user.id === expectedUserID, `user = ${user}`);
    });
    it("should return null if user email does not exist", () => {
      assert.isNull(getUserByEmail("user@absent.com", testUsers));
    });
  });
  

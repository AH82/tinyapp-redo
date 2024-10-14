const { expect, assert } = require('chai');

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

describe("Helper Functions", () => {
  
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
  
  describe("urlsForUser", () => {
    const userUrls = urlsForUser("userRandomID", testUrlDatabase);
    it("should return an object", () => {
      expect(userUrls).to.be.an("object");
      
    });
    it("should return an object with ALL URLs for a specific user", () => {
      // const userUrls = urlsForUser("userRandomID", testUrlDatabase);
      expect(userUrls).to.have.all.keys("b2xVn2", "b2xVn3");
      expect(userUrls["b2xVn2"]).has.all.keys('longURL', 'userID');
      expect(userUrls["b2xVn3"]).has.all.keys('longURL', 'userID');
    });
    it("should not return any other users' urls", () => {
      expect(userUrls).not.to.have.any.keys("9sm5xK", "b6UTxQ", "i3BoGr");
    });
  });
  
});
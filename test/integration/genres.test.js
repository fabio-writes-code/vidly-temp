const request = require("supertest");
const { Genre } = require("../../models/genres"); //*2
const { User } = require("../../models/users");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  }); //*1
  afterEach(async () => {
    await Genre.remove({}); //*4
    await server.close();
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        //*3
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if valid ID is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 on invalid ID", async () => {
      const res = await request(server).get("/api/genres/1"); //*an invalid genredId
      expect(res.status).toBe(404); //*5
    });

    it("should return 404 if Id is valid but no genre with id", async () => {
      const res = await request(server).get(
        "/api/genres/63387277aa1c8dd991bb83d8"
      );
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    //To make the test code more readable: define happy path and change variables in each test to aling with the goal of the test.
    let token, name; //Variables defined separatedly to be altered per test requests

    const exec = async () => {
      //Store happy path as exec function
      return await request(server)
        .post("/api/genres") //post saves the genre to mongoDB
        .set("x-auth-token", token) //Setting auth token as a header for the request object
        .send({ name }); // can be shorthen if key an value are the same, {name:name}
    };

    beforeEach(() => {
      //Default vaules for variables for happy path
      token = new User().generateAuthToken(); //Generating auth token
      name = "genre1";
    });

    it("should return 401 if client not logged in", async () => {
      token = ""; //Overriding auth token
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234"; //Overriding name def for the test
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is longer than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save the genre if valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "Genre1" });
      expect(genre).not.toBe(null);
    });
    it("should return the genre if valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /", () => {
    let newName, token, genre, id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };
    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      token = new User().generateAuthToken();
      newName = "UpdatedGenre";
      id = genre._id;
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre name is less than 5 chars", async () => {
      newName = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is longer than 50 chars", async () => {
      newName = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if Id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with given Id is not found", async () => {
      id = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should update the name of genre if input is valid", async () => {
      await exec();
      const updatedGenre = await Genre.findById(id);
      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE", () => {
    let token, id, genre, user;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      token = new User({ isAdmin: true }).generateAuthToken();
      id = genre._id;
    });

    afterEach(async () => {
      // await User.remove({});
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user does not have admin status", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with given id", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete genre if valid input", async () => {
      await exec();
      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();
    });

    it("should return genre upon deletion", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id", id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});

// ****----****
// *1-When loading the server with this code, everytime the project is saved, jest will automatically run the app.The first time server will listen to port 3000, upon reload an error will be prompted, there will be already a server on port 3000. To avoid this, the server is 'loaded' and 'unloaded' after every test

// *2-Importing the Genre object to simulate mutiple genre objects for testing purposes

// *3-Creating mutiple genre objects and adding them to MongoDB. The properties given within the array will be validated with the expected genre requirements. So length has to be longer than a certin character and so on.

// *4-Removes the autogenerated Genres so the database does not get overpopulated

// *5-Instead of receiving a 404 error, a 500 error is prompted. This error was developer defined using winston (see middleware/winston) and is prompted upon error in app execution. In this case, objectId value of '1' is not a valid objectId. See complementary note *1 in middleware/validateObjectId

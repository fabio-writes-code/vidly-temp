// Testing authorization: auth tested is done separatedly because if affects mutiple functions
const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

describe("auth middleware", () => {
  beforeEach(() => (server = require("../../index"))); //*1
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .send({ name: "genre1" }) //*1
      .set("x-auth-token", token);
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if invalid token is provided", async () => {
    token = null;
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return a valid token", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  // *2
});

// ****----****
// *1-Any route can that utilized authorization can be used to test auth, in this case genres post is used

// *2-To test the payload of a decoded jwt we need access to the request object. Supertest does not allow that functionality. Therefore, for this we use a unit test

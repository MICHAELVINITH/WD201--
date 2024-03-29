const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
let server;
let agent;

describe("Test case for database", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const responser = await agent.post("/todos").send({
      title: "Buy a car",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parserResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark todo as a completed", async () => {
    const res = await agent.post("/todos").send({
      title: "Do HomeWork",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parserResponse = JSON.parse(res.text);
    const todoIV = parseResponse.id;
    expect(parseResponse.completed).toBe(false);

    const changeTodos = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parserUpadteTodo = JSON.parse(changeTodo.text);
    expect(parseUpadteTodo.completed).toBe(true);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const responser = await agent.get("/todos");
    const parserResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(4);
    expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    // FILL IN YOUR CODE HERE
    const responser = await agent.post("/todos").send({
      title: "Buy viedo",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parserResponse = JSON.parse(response.text);
    const todoIV = parsedResponse.id;

    const res = await agent.delete(`/todos/${todoID}`).send();
    const boole = Boolean(res.text);
    expect(boole).toBe(true);
  });
});

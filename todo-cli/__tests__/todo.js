/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Test list of items", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Add overdue item", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Add due today item", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Add due later item", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Mark as complete", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();

    expect(aTodo.completed).toBe(true);
  });

  test("Test completed", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(true);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`
    );
  });

  test("Test incomplete", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const aTodo = dueLaterItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`
    );
  });

  test("Test incomplete dueToday", async () => {
    const dueToday = await db.Todo.dueToday();
    const Todo = dueToday[0];
    expect(Todo.completed).toBe(false);
    const displayValues = Todo.displayableString();
    expect(displayValues).toBe(`${Todo.id}. [ ] ${Todo.title}`);
  });

  test("Test completed dueToday", async () => {
    const dueToday = await db.Todo.dueToday();
    const Todo = dueToday[0];
    expect(Todo.completed).toBe(false);
    await db.Todo.markAsComplete(Todo.id);
    await Todo.reload();
    const displayValues = Todo.displayableString();
    expect(displayValues).toBe(`${Todo.id}. [x] ${Todo.title}`);
  });
});

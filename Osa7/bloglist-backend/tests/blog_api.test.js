const { test, describe, after, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("the id works as id, not _id", async () => {
  const response = await api.get("/api/blogs");

  const ids = response.body.map((e) => e.id);
  assert.strictEqual(ids.length, helper.initialBlogs.length);
});

test("blogs can be added with post", async () => {
  const newBlog = {
    title: "Blogien testaaminen",
    author: "Roope testaaja",
    url: "http://blog.testaus.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

  assert(titles.includes("Blogien testaaminen"));
});

test("if added blogs likes are not set, it is 0", async () => {
  const newBlog = {
    title: "Blogien testaaminen",
    author: "Roope testaaja",
    url: "http://blog.testaus.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const lastlyAdded = response.body[response.body.length - 1];

  assert.strictEqual(lastlyAdded.likes, 0);
});

test("blogs cant be added without title", async () => {
  const newBlog = {
    author: "Roope testaaja",
    url: "http://blog.testaus.com",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blogs cant be added without url", async () => {
  const newBlog = {
    title: "urlin puuttumisen testaava testiblogi",
    author: "Roope testaaja",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const contents = blogsAtEnd.map((r) => r.title);
  assert(!contents.includes(blogToDelete.title));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("a blog can be modified", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToModify = blogsAtStart[0];
  const modifiedBlog = {
    title: "blogin muokkaamisen testaava testiblogi2",
    author: "Roope testaaja",
    url: "www.muutettublogi.fi",
    likes: 5,
  };

  await api.put(`/api/blogs/${blogToModify.id}`).send(modifiedBlog).expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  const contents = blogsAtEnd.map((r) => r.title);
  assert(contents.includes(modifiedBlog.title));
});

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

test("creation fails with too short username", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "ml",
    name: "Matti Luukkainen",
    password: "salainen",
  };

  await api.post("/api/users").send(newUser).expect(400);

  const response = await api.get("/api/users");

  assert.strictEqual(response.body.length, usersAtStart.length);
});

test("creation fails with too short password", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "mlukane",
    name: "Matti Lukainen",
    password: "sa",
  };

  await api.post("/api/users").send(newUser).expect(400);

  const response = await api.get("/api/users");

  assert.strictEqual(response.length, usersAtStart.legth);
});

after(async () => {
  await mongoose.connection.close();
});

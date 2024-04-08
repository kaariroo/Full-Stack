import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import addLike from "../App";
import deleteBlog from "../App";

test("renders content", () => {
  const blog = {
    title: "Testing frontend of the Blog app",
    author: "Roope tester",
    likes: 2,
    url: "testing.com",
    user: {
      username: "roope",
      name: "Roope Kääriäinen",
      id: "65e1a180ba66f695a2ea898a",
    },
  };

  const user = {
    username: "roope",
    name: "Roope Kääriäinen",
    id: "65e1a180ba66f695a2ea898a",
  };

  render(
    <Blog
      blog={blog}
      handlelike={() => addLike(blog.id)}
      handledelete={() => deleteBlog(blog)}
      user={user}
      bloguser={user}
    />,
  );

  screen.debug();

  const element = screen.getByText("Testing frontend of the Blog app");
  expect(element).toBeDefined();
});

test("clicking view button shows rest of the info", async () => {
  const blog = {
    title: "Testing frontend of the Blog app",
    author: "Roope tester",
    likes: 2,
    url: "testing.com",
    user: {
      username: "roope",
      name: "Roope Kääriäinen",
      id: "65e1a180ba66f695a2ea898a",
    },
  };

  const user = {
    username: "roope",
    name: "Roope Kääriäinen",
    id: "65e1a180ba66f695a2ea898a",
  };

  render(
    <Blog
      blog={blog}
      handlelike={() => addLike(blog.id)}
      handledelete={() => deleteBlog(blog)}
      user={user}
      bloguser={user}
    />,
  );
  const appUser = userEvent.setup();
  const button = screen.getByText("view");
  await appUser.click(button);

  const authorElement = screen.getByText("Roope tester");
  const urlElement = screen.getByText("testing.com");
  const likeElement = screen.getByText.toString(2);
  const userElement = screen.getByText("Roope Kääriäinen");

  screen.debug();

  expect(authorElement, urlElement, likeElement, userElement).toBeDefined();
});

test("clicking like button twice", async () => {
  const blog = {
    title: "Testing frontend of the Blog app",
    author: "Roope tester",
    likes: 2,
    url: "testing.com",
    user: {
      username: "roope",
      name: "Roope Kääriäinen",
      id: "65e1a180ba66f695a2ea898a",
    },
  };

  const user = {
    username: "roope",
    name: "Roope Kääriäinen",
    id: "65e1a180ba66f695a2ea898a",
  };

  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
      handledelete={() => deleteBlog(blog)}
      user={user}
      bloguser={user}
    />,
  );
  const appUser = userEvent.setup();
  const viewbutton = screen.getByText("view");
  await appUser.click(viewbutton);
  const likebutton = screen.getByText("like");
  await appUser.click(likebutton);

  screen.debug();

  expect(mockHandler.mock.calls).toHaveLength(1);
});

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleinput = screen.getByPlaceholderText("titletext");
  const authorinput = screen.getByPlaceholderText("authortext");
  const urlinput = screen.getByPlaceholderText("urltext");
  const sendButton = screen.getByText("create");

  await user.type(titleinput, "testing a form title...");
  await user.type(authorinput, "testauthor...");
  await user.type(urlinput, "testurl...");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testing a form title...");
  expect(createBlog.mock.calls[0][0].author).toBe("testauthor...");
  expect(createBlog.mock.calls[0][0].url).toBe("testurl...");
});

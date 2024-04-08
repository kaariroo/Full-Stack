import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/user"
import  { Container, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper } from '@mui/material'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from 'react-router-dom'


const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([])

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    userService
      .getAll()
      .then((users) => setUsers(users));
  }, []);  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      console.log(loggedUserJSON)
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      console.log(user.username);
    } catch (exception) {
      setErrorMessage({ text: "wrong credentials", type: "alert" });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addLike = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      console.log(blog.likes)

      const changedBlog = { ...blog, likes: (blog.likes += 1) };
      console.log(changedBlog);
      console.log(id);

      await blogService.update(id, changedBlog).then((returnedBlog) => {
        setBlogs(
          blogs
            .map((blog) => (blog.id !== id ? blog : returnedBlog))
            .sort((a, b) => b.likes - a.likes),
        );
      });
    } catch (excweption) {
      setErrorMessage({ text: "Sorry, something went wrong.", type: "alert" });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = (blogToDelete) => {
    try {
      const confirmation = window.confirm(
        `Delete blog ${blogToDelete.title} by ${blogToDelete.author}`,
      );
      if (!confirmation) {
        return;
      }

      blogService.remove(blogToDelete.id).then(() => {
        setBlogs(
          blogs
            .filter((blog) => blog.id !== blogToDelete.id)
            .sort((a, b) => b.likes - a.likes),
        );
        setErrorMessage({ text: "Blog deleted.", type: "notification" });
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    } catch (exception) {
      setErrorMessage({ text: "Sorry, something went wrong.", type: "alert" });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addBlog = (blogObject) => {
    blogObject.user = user;
    console.log(user.username);
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setErrorMessage({
        text: `Blog ${blogObject.title} created`,
        type: "notification",
      });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    });
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? "none" : "" };
    const showWhenVisible = { display: blogFormVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  );

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    );
  }

  const Blogs = () => (
    <Container>
      <div>
        <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
        </div>
        <h1>blogs</h1>
        <Notification message={errorMessage} />
        {blogForm()}
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => addLike(blog.id)}
            handleDelete={() => deleteBlog(blog)}
            user={user}
          />
        ))}
      </div>
    </Container>
  )

  const User = ( {users, blogs} ) => {
    const id = useParams().id
    console.log(users)
    console.log(blogs)
    const user = users.find(n => n.id === id)
    console.log(user)
    const usersBlogs = blogs.filter((blog) => blog.user.id === user.id)
    console.log(usersBlogs)
    return(
      <div>
        <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
        </div>
        <div>
          <h2>{user.name}</h2>
        </div>
        <div>
          <h3>added blogs</h3>
        </div>
        <div>
          {usersBlogs.map(blog =>
          <li key={blog.id}>
            {blog.title}
          </li>
          )}
        </div>
      </div>
    )
}

const SingleBlog = ( {blogs} ) => {
  const id = useParams().id
  console.log(blogs)
  const blog = blogs.find(n => n.id === id)
  const thisBlog = blogs.filter((blog) => blog.id === id)
  console.log(thisBlog)
  return(
    <div>
      <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
        </div>
      <h2>{blog.title} {blog.author}</h2>
      <Link to={blog.url}>{blog.url}</Link>
      <div>
        likes {blog.likes} <button onClick={() => addLike(blog.id)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
    </div>
  )
}

const Users= ({ users, message }) => (
  <div>
    <div>
          <p>{user.name} logged in</p>
          {logoutForm()}
        </div>
    <h2>Users</h2>

    <Notification message={message} />


    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>
                {user.blogs.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

  console.log(users)
  console.log(blogs)

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Routes>
        <Route path='/blogs/:id' element={<SingleBlog blogs={blogs} />} />
        <Route path='/users/:id' element={<User users={users} blogs={blogs} />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/users" element={<Users users={users} message={errorMessage}/>} />
      </Routes>
    </Router>
  )
};

export default App;

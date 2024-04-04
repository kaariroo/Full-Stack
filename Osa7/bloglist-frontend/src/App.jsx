import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes)
      ),
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log(user.username)
    } catch (exception) {
      setErrorMessage({ text: 'wrong credentials', type: 'alert' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id)

      const changedBlog = { ...blog, likes: (blog.likes += 1) }
      console.log(changedBlog)
      console.log(id)


      await blogService
        .update(id, changedBlog)
        .then((returnedBlog) => {
          setBlogs(
            blogs
              .map((blog) => (blog.id !== id ? blog : returnedBlog))
              .sort((a, b) => b.likes - a.likes)
          )
        })

    } catch (excweption) {
      setErrorMessage({ text:'Sorry, something went wrong.', type: 'alert' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = (blogToDelete) => {
    try {
      const confirmation = window.confirm(
        `Delete blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
      if (!confirmation) {
        return
      }

      blogService
        .remove(blogToDelete.id)
        .then(() => {
          setBlogs(
            blogs.filter((blog) => blog.id !== blogToDelete.id)
              .sort((a, b) => b.likes - a.likes)
          )
          setErrorMessage({ text:'Blog deleted.', type: 'notification' })
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } catch (exception) {
      setErrorMessage({ text:'Sorry, something went wrong.', type: 'alert' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogObject.user = user
    console.log(user.username)
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage({ text: `Blog ${blogObject.title} created`, type: 'notification' })
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid='username'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid='password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }


    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog}/>
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <div>
        <p>{user.name} logged in</p>
        {logoutForm()}
      </div>
      <h1>blogs</h1>
      <Notification message={errorMessage} />
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => addLike(blog.id)}
          handleDelete={() => deleteBlog(blog)}
          user={user}/>
      )}
    </div>
  )
}

export default App
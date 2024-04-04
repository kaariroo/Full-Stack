import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {

  const [blogExpanded, setBlogExpanded] = useState(false)

  const toggleExpand = () => {
    setBlogExpanded(!blogExpanded)
  }

  console.log(user.username)
  console.log(blog.user.username)

  return (
    <div className="blog">
      <div>
        {blog.title}
        {blogExpanded ? (
          <>
            <button onClick={toggleExpand}>hide</button>
            <div>{blog.author}</div>
            <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
            <div>{blog.url}</div>
            <div>{blog.user.name}</div>
            {(blog.user === user.id) && (
              <button onClick={handleDelete}>delete</button>
            )}
          </>
        ) : (
          <button onClick={toggleExpand}>view</button>
        )}
      </div>
    </div>
  )
}

export default Blog
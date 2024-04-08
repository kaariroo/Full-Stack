import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });

    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          data-testid="title"
          value={newBlogTitle}
          name="Title"
          onChange={(event) => setNewBlogTitle(event.target.value)}
          placeholder="titletext"
        />
      </div>
      <div>
        autor
        <input
          type="text"
          data-testid="author"
          value={newBlogAuthor}
          name="Author"
          onChange={(event) => setNewBlogAuthor(event.target.value)}
          placeholder="authortext"
        />
      </div>
      <div>
        url
        <input
          type="text"
          data-testid="url"
          value={newBlogUrl}
          name="Url"
          onChange={(event) => setNewBlogUrl(event.target.value)}
          placeholder="urltext"
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;

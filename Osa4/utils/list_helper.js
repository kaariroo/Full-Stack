const lodash = require('lodash')

const dummy = (blogs) => {
    return (1)
  }
  
  

const totalLikes = (blogs => {

    let likes = blogs.map((blog) => blog.likes)
    
    const summer = (sum, item) => {
        return sum + item
    }
    return likes.reduce(summer, 0)
})

const favoriteBlog = (blogs) => {
    if (blogs.length <= 0) return 'No blogs'
    const fav =  blogs.reduce((favorite, blog) => {
        return favorite.likes > blog.likes ? favorite : blog
    }, blogs[0])

    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = lodash.groupBy(blogs, 'author')

    const mostWritten = lodash.maxBy(Object.keys(blogsByAuthor), author => blogsByAuthor[author].length)

    return {
        author: mostWritten,
        blogs: blogsByAuthor[mostWritten].length
    }
}

const mostLikes = (blogs) => {
    const likesByAuthor = lodash.groupBy(blogs, 'author')
    
    const mostLiked = lodash.maxBy(Object.keys(likesByAuthor), author =>
      lodash.sumBy(likesByAuthor[author], 'likes')
    )
  
    const totalLikes = lodash.sumBy(likesByAuthor[mostLiked], 'likes')
  
    return {
      author: mostLiked,
      likes: totalLikes
    }
  }

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')


require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/
/*
let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]


  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Author {
      name: String!
      bookCount: Int!
      born: Int
      id: ID!
  }

  type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () =>  Book.collection.countDocuments(),    
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre)
        return Book.find({}).populate('author', {
          name: 1,
          id: 1,
          born: 1,
          bookCount: 1,
        })

      let books = await Book.find({}).populate('author', {
        name: 1,
        id: 1,
        born: 1,
        bookCount: 1,
      })
      const author = await Author.findOne({ name: args.author })
      args.author &&
        (books = books.filter((book) => book.author.name === author.name))
      args.genre &&
        (books = books.filter((book) => book.genres.includes(args.genre)))
      return books
    },
    /*allBooks: async (root, args) => {
      console.log(args)
      let result = await Book.find({}).populate('author', 'name id born bookCount')
      if (args.author) {
        result = result.filter(book => book.author.name === args.author)
      }
      if (args.genre) {
        result = result.filter(book => book.genres.includes(args.genre))
      }
      console.log(result)
      return result
    },*/
    
    /*allBooks: async (root, args) => {
      console.log(args.author, args.genre)
      if (!args.author && !args.genre) {
        return Book.find({})
      }
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author.id, genres: args.genre })
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author })
      }
      if (args.genre) {
        return Book.find({genres: genres.includes(args.genre)})
      }
          
    },*/
      /*
      let books = [... await Book.find({})]
      console.log(books, "ennen koodia")
      books =
      args.author === undefined
        ? books
        : Book.find({ author: args.author })}
        //books.filter(book => book.author.name === args.author)
      books = 
      args.genre === undefined
        ? books
        : books.filter(book =>book.genres.includes(args.genre))
      /*const authorFilter = () => {
        if (!args.author)
      console.log(books[0].author.name, "koodin jälkeen")
      return books
        //return books.filter((book) => book.author === args.author)
      },/*,
      const genreFilter = () => {
        if (!args.genre) {
          return authorFilter()
        }
        return authorFilter().filter((book) => book.genres.includes(args.genre))}
      return genreFilter()
    },*/
    allAuthors: async (root, args) => {
      return Author.find({})
      /*const authors = await Author.find({})
      return authors.map((author) => {
        const authorsBooks = books.filter(
          (book) => book.author === author.name
        ).length
        return{...author, bookCount: authorsBooks}
      })*/
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: async (root) => await Author.findOne({_id: root.author}),
    id: (root) => root.id,
    genres: (root) => root.genres,
  },
  Author: {
    name: (root) => root.name,
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const books = await Book.find({ author: author })
      return books.length
    },    
    born: (root) => root.born
  },
  Mutation: {
    addBook: async (root, args, context) => {
      //if (!authors.find((author) => author.name === args.author)) {
        const authorSearch = await Author.findOne({ name: args.author })
        const currentUser = context.currentUser
        console.log(context)
        console.log("mennäänkö tänne")

          if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }
        console.log(authorSearch)
        if (!authorSearch) {
          const author = new Author({ name: args.author })
          

          try {
            await author.save()
          } catch (error) {
            console.log(error)
            throw new GraphQLError('Saving book failed, author name wrong', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }
        }
        const author = await Author.findOne({ name: args.author })
        console.log("author:",author)
        const book = new Book({ author: author, title: args.title, published: args.published, genres: args.genres});
        try {
          console.log("Saving the book now")
          await book.save()
        } catch (error) {
          console.log(error)
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }
        console.log(book.author.name)
        return book
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser

          if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }
        await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo}
        )
        const updatedAuthor = await Author.findOne({ name: args.name})
        return updatedAuthor
        /*console.log(author)
        if (!author) {
          return null
        }
        const updatedAuthor = {...author, born: args.setBornTo }
        console.log(updatedAuthor)
        await updatedAuthor.save()
        return updatedAuthor*/
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('favoriteGenre')
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
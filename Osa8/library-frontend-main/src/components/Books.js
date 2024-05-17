import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState, useEffect } from 'react'

    
const Books = (props) => {
  const [filteredBooks, setFilteredBooks] = useState([])
  const [filter, setFilter] = useState('')
  
  const [getBooks, {loading, data}] = useLazyQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: 'no-cache',  })

  console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      await getBooks()
    }
    fetchData();
    
  }, [filter, getBooks])

  useEffect(() => {
    if (!loading && data) {
      setFilteredBooks(data.allBooks);
    }
  }, [data, loading]);

  const changeFilter = (genre) => {
    setFilter(genre);
  }

  const allgenres = new Set(props.allBooks.map((b) => b.genres).flat())

  if (!props.show) {
    return null
  }
  if (loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {[...allgenres].map((genre) => (
        <button
        key={genre}
        onClick={() => changeFilter(genre)}
        className={genre === filter ? 'active' : ''}>
        {genre}
        </button>
      ))}
        <button
        onClick={() => changeFilter('')}>
        All genres
        </button>
      
    </div>
  )
}

export default Books

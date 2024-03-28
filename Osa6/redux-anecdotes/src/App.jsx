import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import Filter from './components/Filter'
import { useDispatch } from 'react-redux'


const App = () => {

  const dispatch = useDispatch()
  
  useEffect(() => {
    anecdoteService
    dispatch(initializeAnecdotes())
}, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
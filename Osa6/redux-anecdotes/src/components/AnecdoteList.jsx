import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === 'ALL') {
          return [...anecdotes].sort((a, b) => b.votes - a.votes)
        }
        return [...anecdotes]
          .filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
          .sort((a, b) => b.votes - a.votes)
      })
    const dispatch = useDispatch()

    const vote = (id) => {
        const anecdoteToVote = anecdotes.find((anecdote) => anecdote.id === id)
        console.log(anecdoteToVote)
        anecdoteToVote.votes + 1
        dispatch(updateAnecdote(id))
        dispatch(setNotification(`you voted '${anecdoteToVote.content}'`, 5))
        }

    return(
        <div>{anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
              </div>
            </div>
            )}
        </div>
    )
}

export default AnecdoteList
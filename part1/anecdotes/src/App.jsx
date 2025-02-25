import { useState } from 'react'
const Header = ({title}) => (<h1>{ title }</h1>)

const Button = ({ onClickEvent, text }) => (<button onClick={ onClickEvent }>{ text }</button>)

const Anecdotes = ({anecdote, votes}) => {
  return (
    <>
      {anecdote}
      <br/>
      <p>has { votes } votes</p>
      <br/>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const voteArray = Array(anecdotes.length).fill(0)
  const [votes, setVotes] = useState(voteArray)
  const [mostVote, setMostVote] = useState(0)

  const NextAnecdote = () => {
    const anecdoteRandom = Math.floor(Math.random() * anecdotes.length);
    setSelected(anecdoteRandom)
  }
  const AddVotes = () => {
    const copyArray = [...votes]
    copyArray[selected] += 1
    setVotes(copyArray)

    const mostVote = copyArray.indexOf(Math.max(...copyArray))
    setMostVote(mostVote)
  }
  return (
    <div>
      <Header title="Anecdote of the day" />
      <Anecdotes anecdote={ anecdotes[selected] } votes={ votes[selected] } />
      <Button onClickEvent={ AddVotes } text="Vote" />
      <Button onClickEvent={ NextAnecdote } text="Next anecdote" />
      <Header title="Anecdote with most votes" />
      <Anecdotes anecdote={ anecdotes[mostVote] } votes={ votes[mostVote] } />
    </div>
  )
}

export default App

import { useState } from 'react'

const Header = (props) => {
  console.log(props)
  return(
    <div>
      <h1>
        {props.header}
      </h1>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  return(
    <tr>{props.text} <td>{props.value}</td></tr>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [sum, setSum] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    const updatedAll = all + 1
    setAll(updatedAll)
    const updatedSum = sum + 1
    setSum(updatedSum)
    setAverage(updatedSum / updatedAll)
    setPositive(100 / updatedAll * updatedGood)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    const updatedAll = all + 1
    setAll(updatedAll)
    const updatedSum = sum + 0
    setSum(updatedSum)
    setAverage(updatedSum / updatedAll)
    setPositive(100 / updatedAll * good)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    const updatedAll = all + 1
    setAll(updatedAll)
    const updatedSum = sum - 1
    setSum(updatedSum)
    setAverage(updatedSum / updatedAll)
    setPositive(100 / updatedAll * good)
  }
  if (all === 0) {
    return (
      <div>
        <Header header="give feedback"/>
        <Button handleClick= {() => handleGoodClick()} text="good" />
        <Button handleClick= {() => handleNeutralClick()} text="neutral" />
        <Button handleClick= {() => handleBadClick()} text="bad" />
        <Header header="statistics"/>
        <StatisticLine text="no feedback given"/>
      </div>
    )
  }

  return (
    <div>
      <Header header="give feedback"/>
      <Button handleClick= {() => handleGoodClick()} text="good" />
      <Button handleClick= {() => handleNeutralClick()} text="neutral" />
      <Button handleClick= {() => handleBadClick()} text="bad" />
      <Header header="statistics"/>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={all}/>
      <StatisticLine text="average" value={average}/>
      <StatisticLine text="positive" value={positive}/> 
    </div>
  )
}

export default App
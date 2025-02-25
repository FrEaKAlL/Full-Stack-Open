import { useState } from 'react'
const Header = ({ title }) => (<h1>{ title }</h1>)

const Button = ({ onClickEvent, text }) => (<button onClick={ onClickEvent }>{ text }</button>)

const StatisticLine = ({total, text, charter }) => {
  return (
    <tr>
      <td>{ text }</td>
      <td>{ total } { charter }</td>
    </tr>
  )
}

const Statistics = ({ values }) => {
  if (values.allComments.value == 0){
    return (
      <div>
        No feedback give
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text={ values.good.text } charter={ values.good.charter } total={ values.good.value } />
        <StatisticLine text={ values.neutral.text } charter={ values.neutral.charter } total={ values.neutral.value } />
        <StatisticLine text={ values.bad.text } charter={ values.bad.charter } total={ values.bad.value } />
        <StatisticLine text={ values.allComments.text } charter={ values.allComments.charter } total={ values.allComments.value } />
        <StatisticLine text={ values.average.text } charter={ values.average.charter } total={ values.average.value } />
        <StatisticLine text={ values.positive.text } charter={ values.positive.charter } total={ values.positive.value } />
      </tbody>
    </table>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allComments, setAllComments] = useState(0)
  const [positive, setPositive] = useState(0)
  const [average, setAverage] = useState(0) 

  const CalculatePositive = (_good, updatedTotal ) => {
    const totalPositive = (_good * 100) / updatedTotal
    setPositive(totalPositive)
  }
  const CalculateAverage = (good, neutral, bad) => {
    const totalAverage = ((good + ((bad) * -1)) / (good + neutral + bad))
    setAverage(totalAverage)
  }
  const CountClickGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setAllComments(updatedGood + neutral + bad)
    CalculatePositive(updatedGood, updatedGood + neutral + bad)
    CalculateAverage(updatedGood, neutral, bad)
  }
  const CountClickNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setAllComments(updatedNeutral + good + bad)
    CalculatePositive(good, updatedNeutral + good + bad)
    CalculateAverage(good, updatedNeutral, bad)
  } 
  const CountClickBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAllComments(updatedBad + good + neutral)
    CalculatePositive(good, updatedBad + good + neutral)
    CalculateAverage(good, neutral, updatedBad)
  }

  const statistics = {
    good: {
      text: "Good",
      charter: "",
      value:good
    },
    neutral: {
      text: "Neutral",
      charter: "",
      value: neutral
    },
    bad: {
      text: "Bad",
      charter: "",
      value: bad
    },
    allComments: {
      text: "All",
      charter: "",
      value: allComments
    },
    average: {
      text: "Average",
      charter: "",
      value: average
    },
    positive: {
      text: "Positive",
      charter: "%",
      value: positive
    }
  }

  return (
    <div>
      <Header title="Give FeedBack"/>
      <Button onClickEvent={ CountClickGood } text="Good" />
      <Button onClickEvent={ CountClickNeutral } text="Neutral" />
      <Button onClickEvent={ CountClickBad } text="Bad" />
      <Header title="Statistics"/>
      <Statistics values={ statistics } />
    </div>
  )
}

export default App
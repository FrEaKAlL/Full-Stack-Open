const Total = ({ parts }) => (<b>Total of { parts.map(part => part.exercises).reduce((a,b) => a + b, 0) } exercises</b>)

export default Total
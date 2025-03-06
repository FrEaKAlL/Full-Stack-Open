import Part from './Part'

const Content = ({ parts }) => (
  <ul>
    { parts.map(part => <Part key={ part.id } part={ part } />) }
  </ul>
)

export default Content
const Header = (props) => {
    console.log(props)
    return(
      <div>
        <h2>
          {props.course}
        </h2>
      </div>
    )
  }
  
  const Part = (props) => {
    console.log(props)
    return(
      <div>
        <p>
          {props.name} {props.exercises}
        </p>
      </div>
    )
  }
  
  const Content = (props) => {
    console.log(props)
    const { parts } = props
    return(
      <div>
        <ul>
          {parts.map(part =>
            <li key={part.id}>
              <Part name={part.name} exercises={part.exercises}/>
            </li>
          )}
        </ul>
      </div>
    )
  }
  
  
  const Total = (props) => {
    console.log(props)
    const result = props.parts.map(part => part.exercises)
    const sum = result.reduce((partialSum, a) => partialSum + a, 0)
    console.log(sum)
    return(
      <div>
        <p>total of {sum} exercises </p>
      </div>
    )
  }
  
  const Course = (props) => {
    console.log(props)
    return(
      <div>
        <Header course = {props.course.name}/>
        <Content parts = {props.course.parts}/>
        <Total parts = {props.course.parts}/>
      </div>
    )
  }
  
  export default Course
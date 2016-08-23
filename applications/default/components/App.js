import React from 'react'
import {Link} from 'react-router'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>ReactJS Server</h1>
        {this.props.children}
      </div>
    )
  }
}

export default App;
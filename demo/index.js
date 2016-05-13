import "./demo.css"
import React from "react"
import ReactDOM from "react-dom"

const App = React.createClass({

  getInitialState() {
    return {
      inverted: false,
    }
  },

  displayName: "App",

  handler() {
    this.setState({
      inverted: !this.state.inverted,
    })
  },

  render() {
    const {inverted} = this.state
    const className = inverted ? "inverted" : ""
    return (
      <div
        onClick={this.handler}
        className={`foo ${className}`}
      >Click Me</div>
    )
  },

})


ReactDOM.render(React.createElement(App), document.getElementById("app"))

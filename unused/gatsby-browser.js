import React from "react"
import { silentAuth } from "./src/utils/auth"

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
  }

  // If we successfully mounted, we can set this.state.loading to false
  componentDidMount() {
    silentAuth(this.handleCheckSession)
  }

  // Only render the UI if this.state.loading is false
  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{this.props.children}</React.Fragment>
      )
    )
  }
}

export const wrapRootElement = ({ element }) => {
  return <SessionCheck>{element}</SessionCheck>
}

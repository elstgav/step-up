import React from 'react'
import Helmet from 'react-helmet'
import {LoginRegister} from '_/src/containers'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <LoginRegister />
    )
  }
}
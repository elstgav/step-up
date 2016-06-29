import React from 'react'
import Helmet from 'react-helmet'
import { RegisterForm, ErrorMessageBanner } from 'src/components'
import {getFirebase} from 'src/lib/firebaseAdapter'
import { browserHistory } from 'react-router';

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {
        name: '',
        email: '',
        password: '',
        homefloor: ''
      },
      error: false
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    let self = this;
    getFirebase().auth().createUserWithEmailAndPassword(this.state.fields.email, this.state.fields.password)
    .then(user => {
      browserHistory.push('/')
    }).catch(function(error) {
      var errorCode = error.code
      var errorMessage = error.message
      self.setState({error: errorMessage})
    })
  }

  handleInputChange = (e) => {
    const field = e.target.name
    let fields = this.state.fields
    fields[field] = e.target.value
    this.setState[{fields: fields}]
  };

  render() {
    return (
      <div>
        <Helmet title='Register'/>
        <RegisterForm handleFormSubmit={this.handleFormSubmit} handleInputChange={this.handleInputChange} toggle={this.props.toggle} />
        {this.state.error && <ErrorMessageBanner errorMessage={this.state.error} />}
      </div>
    )
  }
}

import React from 'react'
import moment from 'moment'
import Helmet from 'react-helmet'

import Person        from 'src/lib/Person'

import { getFirebase } from 'src/lib/firebaseAdapter'

import {
  DatePicker,
  FlightsForm,
} from 'src/components'


export class FlightTrackerPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      entryDate: moment(),
      person: new Person({}),
    }
  }

  componentDidMount() {
    getFirebase().auth().onAuthStateChanged(user => {
      if (user) {
        getFirebase().database()
          .ref(`users/${user.uid}`)
          .on('value', snapshot => {
            this.setState({ user: Object.assign({}, snapshot.val(), { uid: user.uid }) })
            this.getFlightsClimbed(this.state.user.uid, this.state.entryDate.format('YYYY-MM-DD'))
            this.state.person.homeFloor = this.state.user.homeFloor
            this.setState({ person: this.state.person })
          })
      }
    })
  }

  onEntryDateChanged = (entryDate) => {
    this.setState({ entryDate })
    this.getFlightsClimbed(this.state.user.uid, entryDate.format('YYYY-MM-DD'))
  }

  onFlightsChanged = (flights) => {
    this.state.person.flightsClimbed.set(this.state.entryDate, flights)
    this.setState({ person: this.state.person })
    this.setFlightsClimbed(flights, this.state.user.uid, this.state.entryDate.format('YYYY-MM-DD'))
  }

  getFlightsClimbed = (uid, date) => {
    getFirebase().database()
                 .ref(`flights/${uid}/${date}`)
                 .once('value')
                 .then(snapshot => {
                   const data = snapshot.val()
                   if (data) {
                     console.log('Getting:', `flights/${uid}/${date}`, data)
                     this.state.person.flightsClimbed.set(
                       this.state.entryDate, data.flights_climbed)
                     this.setState({ person: this.state.person })
                   }
                 })
  }

  setFlightsClimbed = (flights, uid, date) => {
    console.log('Storing:', `flights/${uid}/${date}`, flights)
    getFirebase().database()
           .ref(`flights/${uid}/${date}`)
           .update({ flights_climbed: flights })
  }

  render() {
    return (
      <div className="container">
        {<Helmet title="Home" />}

        {this.state.user && <p>Hello {this.state.user.name}!</p>}

        <DatePicker
          selected={this.state.entryDate}
          onChange={this.onEntryDateChanged}
        />
        <FlightsForm
          homeFloor={this.state.person.homeFloor}
          value={this.state.person.flightsClimbed.get(this.state.entryDate)}
          onChange={this.onFlightsChanged}
        />
      </div>
    )
  }
}

FlightTrackerPage.contextTypes = {
  data: React.PropTypes.object,
}

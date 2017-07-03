import React, { Component } from 'react'
import { workRef } from '../../config'


export default class SocialStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    let eventName = this.props.history.location.pathname.split('/socialData/')[1]
    workRef.child('nextBigSound').push()

  }

  render() {
    return (
      <div> Hello World </div>
    )
  }
}
import React, { Component } from 'react'
import { reportRef, artistRef } from '../../config'
import { eliminateDuplicates } from '../../utils'
import {Line} from 'rc-progress'
import Select from 'react-select'


export default class Calculator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      percentageSellout: 0,
      showResults: false,
      vanues: [],
      artists: [],
      artistsLoading: true,
      venuesLoading: true,
      history: {}
    }
    this.fetchArtists = this.fetchArtists.bind(this)
    this.fetchVenues = this.fetchVenues.bind(this)
    this.startSimulation = this.startSimulation.bind(this)
  }
  componentDidMount() {
    console.log()
    this.fetchArtists()
    this.fetchVenues()
  }
  fetchArtists() {
    let artists = []
    artistRef.limitToLast(1000).once('value', s => {
     Object.keys(s.val()).map(k => {
       let val = k.split('-').join(' ')
        artists.push({label:val, value:val})
     })
    }).then(() => {
      this.setState({
        artists,
        artistsLoading: false
      })
    })
  }

  fetchVenues() {
    let venues = []
    reportRef
    .child('2017')
    .limitToLast(1000)
    .once('value', s => {
      Object.keys(s.val()).map(k => {
        venues.push({label:s.val()[k].Venue, value: s.val()[k].Venue})
      })
    })
    .then(() => {
      let final = eliminateDuplicates(venues.map(item => item.label))

        this.setState({
          venues:final.map(item => ({label:item, value: item})),
          venuesLoading: false
        })
        
      })
  }
  startSimulation() {
    console.log('start simulation called with', this.state)
    if(this.state.history[this.state.venue.label+this.state.artist.label] !== undefined) {
      this.setState({
        percent: this.state.history[this.state.venue.label+this.state.artist.label],
        showResults: true
      })
      return 
    }
    this.setState({
      showResults: true
    })
    let simulate = setInterval(() => {
      let res = Math.random()*100
        this.setState({
          percent: res
      })
    }, 100)
    setTimeout(() => {
      clearInterval(simulate)
      this.setState({
        history: Object.assign({}, this.state.history, {[this.state.venue.label+this.state.artist.label]: this.state.percent})
      })

    }, 10000)
    // this.setState({
    //   percent: percentageArray[Math.floor(Math.random()*percentageArray.length)],
    // })
  }

  render() {
    console.log(this.state.percent)
    if(this.state.artistsLoading && this.state.venuesLoading) {
      return (<h4> Artists and venues are loading...</h4>)
    }
    else if(this.state.artistsLoading) {
      return (<h4> Artists are still loading> </h4>)
    }
    else if(this.state.venuesLoading) {
      return (<h4> Venues are still loading </h4>)
    }
    else {
      return (
      <div className='animated fadeIn'> 
        <div className='row'> 
          <div className='col-md-6 col-sm-6 col-xs-6'> 
            <div className='card'> 
              <div className='card-header'> 
                <strong> Decision </strong>
                <small> Form </small>
              </div>
              <div className='card-block'> 
                <div className='form-group'> 
                  <label for='Artist'> Artist </label>
                  <Select
                    options={this.state.artists}
                    value={this.state.artist}
                    onChange={(artist) => this.setState({artist})}
                  />
                </div>
                <div className='form-group'> 
                  <Select
                    options={this.state.venues}
                    value={this.state.venue}
                    onChange={(venue) => this.setState({venue})}
                  />
                </div>
                <div className='form-group'> 
                  <button className='btn btn-success' onClick={this.startSimulation}> Submit </button>
                </div>
              </div>
            </div>
          </div>
          {this.state.showResults ?
            <div className='col-md-6 col-sm-6 col-xs-6'> 
            <div className='card card-inverse card-primary'> 
              <div className='card-block'>
                <h4> liklihood of sell out {Math.floor(this.state.percent)}% </h4> 
                <Line percent={this.state.percent} strokeWidth='4' strokeColor='#D3D3D3' />
              </div>
            </div>
          </div>: null
        }
        </div>
      </div>
    )
    }
    
  }
}
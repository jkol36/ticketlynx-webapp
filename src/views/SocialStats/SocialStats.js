import React, { Component } from 'react'
import numeral from 'numeral'
import { 
  queryRef, 
  artistRef,
  scoresRef,
  topCitiesRef,
  topCountriesRef,
  pollstarRef,
  albumRef } from '../../config'


export default class SocialStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      query: {}
    }
  }

  componentDidMount() {
    let eventName = this.props.history.location.pathname.split('/socialData/')[1]
    this.setState({
      query: eventName
    })
    albumRef.on('child_added', s => {
      console.log('yooo', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.keys(s.val()).map(k => s.val()[k])[0]
        })
      }
    })
    albumRef.on('child_changed', s => {
      console.log('yooo', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.keys(s.val()).map(k => s.val()[k])[0]
        })
      }
    })

    artistRef.on('child_changed', s => {
      console.log('artist ref', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    artistRef.on('child_added', s => {
      console.log('artist ref', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    scoresRef.on('child_changed', s => {
      console.log('scores ref changed', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    scoresRef.on('child_added', s => {
      console.log('scores ref added', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    topCitiesRef.on('child_added', s => {
      console.log('top cities added', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, {topCities:s.val()})
        })
      }
    })
    topCitiesRef.on('child_changed', s => {
      console.log('top cities changed', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, {topCities:s.val()})
        })
      }
    })
    topCountriesRef.on('child_added', s => {
      console.log('top countries added', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, {topCountries:s.val()})
        })
      }
    })
    topCountriesRef.on('child_changed', s => {
      console.log('top countries changed', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    pollstarRef.on('child_changed', s => {
      console.log('poll star data changed', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    pollstarRef.on('child_added', s => {
      console.log('poll star data added', s.key, s.val())
      if(s.key.split('-').join('').toLowerCase() === this.state.query.split(' ').join('').toLowerCase()) {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      }
    })
    queryRef.push(eventName)

  }

  componentWillUnmount() {
    topCountriesRef.off()
    topCitiesRef.off()
    queryRef.off()
    scoresRef.off()
    artistRef.off()
    albumRef.off()
    pollstarRef.off()
  }

  render() {
    let resultRow = {
      marginTop:'30px'
    }
    console.log(this.state)
    if(this.state.loading) {
      return (
        <div className='animated fadeIn'> 
          <i className='fa fa-spinner fa-spin'> </i>
        </div>
      )
    }
    return (
      <div className='animated fadeIn'> 
        <div className='row'> 
          <div className='col-lg-8'> 
            <input className='form-control' onChange={this.handleSearchInput} value={this.state.query} placeholder='search for an artist'/>
          </div>
          <div className='col-lg-4'> 
            <button className='btn btn-success' onClick={this.handleSearchSubmit}> Search </button>
          </div>
        </div>
        <div style={resultRow} className='row'>
          <div className='col-lg-2'> 
            <div className='card'> 
              <div className='card-header white card-primary px-3 py-3 clearfix font-weight-bold font-sm btn-block'> 
                Latest Album
              </div>
              <div className='card-block p-3 clearfix'> 
                <img className='float-left p-3' height='110' src={this.state.queryResult ? this.state.queryResult.albumImage: ''}/>
                <div className='h5 text-info mb-0 mt-2'> 
                  {this.state.queryResult ? this.state.queryResult.name: ''}
                </div>
                <div className='text-muted text-uppercase font-weight-bold font-xs'> 
                  {this.state.queryResult ? this.state.queryResult.releaseDate: ''}
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='social-box twitter fixed-height'>
              <i className='fa fa-twitter'/> 
              <ul> 
                <li> 
                  <strong> {this.state.queryResult.followersCount ? numeral(this.state.queryResult.followersCount).format('0 a'):''} </strong> 
                  <span> Followers </span> 
                </li>
                <li> 
                  <strong> {this.state.queryResult.friendsCount ? numeral(this.state.queryResult.friendsCount).format('0 a'):''} </strong> 
                  <span> Following </span> 
                </li>
              </ul>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='card card-inverse card-success fixed-height'> 
              <div className='card-block fixed-height'> 
                <div className='h1 text-muted text-right mb-2'> 
                  <i className='icon-speedometer'></i>
                </div>
                <div className='h4 mb-0'>
                  {this.state.queryResult.trend ? this.state.queryResult.trend: ''}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Current Trend </small>
              </div>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='card card-inverse card-primary fixed-height'> 
              <div className='card-block fixed-height'> 
                <div className='h1 text-muted text-right mb-2'> 
                  <i className='fa fa-money'></i>
                </div>
                <div className='h4 mb-0'>
                  {this.state.queryResult.avgGross ? this.state.queryResult.avgGross: ''}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Average Gross </small>
              </div>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='card card-inverse card-danger fixed-height'> 
              <div className='card-block fixed-height'> 
                <div className='h1 text-muted text-right mb-2'> 
                  <i className='fa fa-money'></i>
                </div>
                <div className='h4 mb-0'>
                  {this.state.queryResult.avgTicketsSold ? this.state.queryResult.avgTicketsSold: ''}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Average Tickets Sold </small>
              </div>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='card card-inverse card-warning fixed-height'> 
              <div className='card-block fixed-height'> 
                <div className='h1 text-muted text-right mb-2'> 
                  <i className='fa fa-line-chart'></i>
                </div>
                <div className='h4 mb-0'>
                  {this.state.queryResult.headLineShows ? this.state.queryResult.headLineShows: ''}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Headline Shows </small>
              </div>
            </div>
          </div>
          <div className='col-lg-6'> 
            <div className='card'>
              <div className='card-header'><h4 className='mb-2'>Top Countries </h4></div>
              <div className='card-block'> 
                <ul className='top-countries'>
                  {this.state.queryResult.topCountries ? this.state.queryResult.topCountries.map(country => {
                    return (
                      <div className='card card-primary'> 
                        <div className='card-block'> 
                          <div className='h4 mb-0 text-white'> 
                            {numeral(country.percent/100).format('0%')}
                          </div>
                          <small className='text-uppercase text-white font-weight-bold'>{country.title}</small>

                        </div>
                      </div>
                    )
                  }):''} 
                  
                </ul>
              </div>
            </div>
          </div>
          <div className='col-lg-6'> 
            <div className='card'>
              <div className='card-header'> <h4 className='mb-2'>Top Cities </h4></div>
              <div className='card-block'> 
                <ul className='top-countries'>
                {this.state.queryResult.topCities ? this.state.queryResult.topCities.map(city => {
                  return (
                    <div className='card card-primary'> 
                      <div className='card-block'> 
                        <div className='h4 mb-0 text-white'> 
                          {numeral(city.percent/100).format('0%')}
                        </div>
                        <small className='text-white text-uppercase font-weight-bold'>{city.title}</small>

                      </div>
                    </div>
                  )
                }):''} 
              
            </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
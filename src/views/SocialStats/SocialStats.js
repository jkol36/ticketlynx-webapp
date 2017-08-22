import React, { Component } from 'react'
import numeral from 'numeral'
import { 
  queryRef, 
  artistRef,
  scoresRef,
  topCitiesRef,
  topCountriesRef,
  reportRef,
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
    queryRef.push(eventName, () => {
      this.setState({
        loading:true,
        query:eventName
      })
    })
    .then(() => {
      let url = this.state.query.split(' ').join('-')
      let artstRef = artistRef.child(url)
      let albmRef = albumRef.child(url)
      let scresRef = scoresRef.child(url)
      let tpCitiesRef = topCitiesRef.child(url)
      let tpCountriesRef = topCountriesRef.child(url)

      albmRef
      .once('value', s => {
        let changes = {}
        if(s.exists()) {
          Object.keys(s.val()).map(k => {changes[k] = s.val()[k]})
          this.setState({
            loading:false,
            queryResult: Object.assign({}, this.state.queryResult, changes)
          })
        }
      })

      albmRef
      .on('child_changed', s => {
        console.log('albmREf changed', s.val())
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, {[s.key]:s.val()})
        })
      })
      albmRef
      .on('child_added', s => {
        console.log('album ref added', s.val())
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      scresRef.once('value', s => {
        let changes = {}
        if(s.exists()) {
          Object.keys(s.val()).map(k => {changes[k] = s.val()[k]})
          this.setState({
            loading:false,
            queryResult: Object.assign({}, this.state.queryResult, changes)
          })
        }
      })
      scresRef.on('child_changed', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      scresRef.on('child_added', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      tpCitiesRef.once('value', s => {
        if(s.exists()) {
          this.setState({
            loading: false,
            queryResult: Object.assign({}, this.state.queryResult, {topCities: s.val()})
          })
        }
      })

      tpCitiesRef.on('child_changed', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      tpCitiesRef.on('child_added', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      tpCountriesRef.once('value', s => {
        if(s.exists()) {
          this.setState({
            loading: false,
            queryResult: Object.assign({}, this.state.queryResult, {topCountries: s.val()})
          })
        }
      })

      tpCountriesRef.on('child_changed', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })
      tpCountriesRef.on('child_added', s => {
        this.setState({
          loading:false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })

      artstRef
      .once('value', s => {
        console.log('yooo')
        let changes = {}
        if(s.exists()) {
          Object.keys(s.val()).map(k => {changes[k] = s.val()[k]})
          this.setState({
            loading:false,
            queryResult: Object.assign({}, this.state.queryResult, changes)
          })
        }
      })
      artstRef
      .on('child_changed', s => {
        console.log('something changed')
        this.setState({
          loading: false,
          queryResult: Object.assign({}, this.state.queryResult, s.val())
        })
      })
      artstRef
      .on('child_added', s => {
        console.log('something changed', s.val())
        this.setState({
          loading: false,
          queryResult: Object.assign({}, this.state.queryResult, {[s.key]:s.val()})
        })
      })

      reportRef
        .child('2017')
        .orderByChild('Event Name')
        .equalTo(this.state.query)
        .once('value', s => {
          if(s.exists()) {
            this.setState({
              loading:false,
              queryResult: Object.assign({}, this.state.queryResult, {reportData: s.val()})
            })
          }
        })
      })
  }

  componentWillUnmount() {
    topCountriesRef.off()
    topCitiesRef.off()
    queryRef.off()
    scoresRef.off()
    artistRef.off()
    albumRef.off()
    reportRef.off()
  }

  render() {
    let avgProfit = 0
    let totalTicketsBought = 0
    let totalProfit = 0
    if(this.state.queryResult) {
      if(this.state.queryResult.reportData) {
        totalTicketsBought = Object.keys(this.state.queryResult.reportData).length
        Object.keys(this.state.queryResult.reportData).forEach(ticketKey => {
          totalProfit += +this.state.queryResult.reportData[ticketKey].Profit
        })
        console.log(`total profit ${totalProfit}`)
        console.log(`average profit per ticket ${totalProfit/totalTicketsBought}`)
        avgProfit = totalProfit/totalTicketsBought
      }
    }
    let resultRow = {
      marginTop:'30px'
    }
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
            <div style={{height:'245px'}}className='card'> 
              <div className='card-header white card-primary px-3 py-3 clearfix font-weight-bold font-sm btn-block'> 
                Latest Album
              </div>
              <div  className='card-block p-3 clearfix'> 
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
            <div style={{height:'245px'}} className='card'> 
              <div className='card-header white card-primary px-3 py-3 clearfix font-weight-bold font-sm btn-block'> 
                HomeTown
              </div>
              <div className='card-block p-3 clearfix'> 
                <div className='h5 text-info mb-0 mt-2'> 
                  {this.state.queryResult ? this.state.queryResult.homeTown: ''}
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
                  ${Math.floor(totalProfit)}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Total Profit </small>
              </div>
            </div>
          </div>
          <div className='col-lg-2'> 
            <div className='card card-inverse card-danger fixed-height'> 
              <div className='card-block fixed-height'> 
                <div className='h1 text-muted text-right mb-3'> 
                  <i className='fa fa-money'></i>
                </div>
                <div className='h4 mb-0'>
                  ${Math.floor(avgProfit)}
                </div>
                <small className='text-muted text-uppercase font-weight-bold'> Average Profit Per Ticket </small>
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
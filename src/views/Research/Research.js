import React, { Component } from 'react'
import numeral from 'numeral'
import { 
  queryRef, 
  artistRef,
  scoresRef,
  albumRef } from '../../config'


export default class Research extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      query: '',
      queryResult: {}
    }
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }

  handleSearchInput(e) {
    e.preventDefault();
    this.setState({
      query: e.target.value
    })
  }

  handleSearchSubmit() {
    queryRef.push(this.state.query, () => {
      this.setState({
        loading:true
      })
    })

  }

  componentDidMount() {
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
          <div className='col-lg-4'> 
            <div className='card'> 
              <div className='card-header white card-primary px-3 py-3 clearfix font-weight-bold font-sm btn-block'> 
                Latest Album
              </div>
              <div className='card-block p-3 clearfix'> 
                <img className='float-left p-3' height='160' src={this.state.queryResult ? this.state.queryResult.albumImage: ''}/>
                <div className='h5 text-info mb-0 mt-2'> 
                  {this.state.queryResult ? this.state.queryResult.name: ''}
                </div>
                <div className='text-muted text-uppercase font-weight-bold font-xs'> 
                  {this.state.queryResult ? this.state.queryResult.releaseDate: ''}
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-4'> 
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
          <div className='col-lg-4'> 
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
        </div>
      </div>
    )
  }
}
import { onSaleRef } from '../../config'
import React, { Component } from 'react'
import moment from 'moment'
import ReactToolTip from 'react-tooltip'
import { Link } from 'react-router-dom'
import { eliminateDuplicates } from '../../utils'

class OnSaleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      onSaleItems: [],
      count:10,
      year:'2017',
      startIndex: 0,
      endIndex:10,
      query: ''
    }
    this.fetchOnSaleList = this.fetchOnSaleList.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.filterItems = this.filterItems.bind(this)
    this.paginate = this.paginate.bind(this)
  }
  componentDidMount() {
    this.fetchOnSaleList()
  }

  handleClick() {
    this.setState({
      count: this.state.count + 10
    })
    setTimeout(() => this.fetchOnSaleList(), 2000)
  }

  fetchOnSaleList() {
    console.log('fetching items')
    let onSaleItems = []
    onSaleRef.limitToLast(this.state.count).once('value', s => {
      console.log(s.val())
      if(s.exists()) {
        Object.keys(s.val()).map(k => {
          onSaleItems.push(s.val()[k])
        })
      }
    }).then(() => {
      this.setState({
        loading:false,
        onSaleItems
      })
    })
  }

  filterItems() {
    if (this.state.query.length < 3)
      return this.state.onSaleItems
    const regex = new RegExp(this.state.query, 'gi')
    return this.state.onSaleItems.filter(t =>
      (t.venue.match(regex)) ||
      t.eventName.match(regex) ||
      t.city.match(regex)
    )
  }

  paginate() {
    this.setState({
      count: this.state.count+10,
      loading:true
    })
    setTimeout(() => this.fetchOnSaleList(), 2000)
  } 

  render() {
    console.log('this.state.startIndex', 'this.state.endIndex', this.state.startIndex, this.state.endIndex)
    const onSaleTableStyle = {
      'tableLayout':'fixed'
    }
    let providers = eliminateDuplicates(this.state.onSaleItems.map(item => item.provider))
    let tableHeaders = []
    providers.forEach(provider => {
      let keys = Object.keys(this.state.onSaleItems.filter(item => item.provider === provider)[0])
      keys.forEach(key => {
        if(tableHeaders.indexOf(key) === -1) 
          tableHeaders.push(key)
      })
      //tableHeaders.push(Object.keys(this.state.onSaleItems.filter(item => item.provider === provider)[0]))
    })
    eliminateDuplicates(tableHeaders)
    let onSaleItems = this.filterItems()
    .sort((a,b) => moment(b.onSaleDate) - moment(a.onSaleDate))
    .sort((a, b) => +a.onSaleTime.split(' ')[0].split(':')[0] - +b.onSaleTime.split(' ')[0].split(':')[0])
    .map((item, index) => {
      return (
        <tr key={index}>
            <td> {item['eventName']} 
              <br></br>
              <Link to={`/socialData/${item.eventName}`} activeClassName='active' data-for='test' data-tip='View Social Data'>
                <ReactToolTip id='test'/>
                <i className='fa fa-info-circle' style={{cursor:'pointer'}}/> 
              </Link>
            </td> 
          {Object.keys(item).map(k => {
            if(k !== 'My Notes' && k !== 'eventName' && k !== 'publicSaleUrl' && k !== 'ticketLink' && k !=='provider') {
              return (<td key={k}> {item[k]} </td>)
            }
          })}
          <td> <a className='btn btn-success' target='_blank' href={item.provider === 'Stublr' ? item.publicSaleUrl: item.ticketLink} style={{color:'white'}}> Buy tickets </a></td>

        </tr>
      )
    })

    if(this.state.loading) {
      return (
        <div className='row'> 
          fetching onsale list...
        </div>)
    }
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='card'>
              <div className='card-block'>
              <input placeholder='type something to filter events' className='form-control' onChange={(e) => this.setState({query:e.target.value})} value={this.state.query}/> 
              <table style={onSaleTableStyle} className='table'> 
                <thead> 
                  <tr>
                  <th> Event Name </th>
                    {tableHeaders.map((k, index) => {
                      if(k !== 'My Notes' && k !== 'publicSaleUrl' && k !=='ticketLink' && k !== 'eventName' && k !=='provider')
                      return (<th key={index}>{k}</th> )
                    })}
                    <th> purchase </th>
                  </tr>
                </thead>
                <tbody>
                  {onSaleItems} 
                </tbody>
              </table>
              <ul className='pagination'>
                <li className='page-item'> 
                  <a className='page-link' onClick={this.paginate} style={{color:'#20a8d8'}}>Load 10 more</a>
                </li>
              </ul>
            </div>
            </div>
        </div>
      </div>
    </div>
    )
  }
}

export default OnSaleList


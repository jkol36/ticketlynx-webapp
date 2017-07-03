import { reportRef } from '../../config'
import React, { Component } from 'react'

class Reports extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      reports: [],
      count:10,
      year:'2017'
    }
    this.fetchReports = this.fetchReports.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.changeYear = this.changeYear.bind(this)
  }
  componentDidMount() {
    this.fetchReports()
  }

  handleClick() {
    this.setState({
      count: this.state.count + 10
    })
    setTimeout(() => this.fetchReports(), 2000)
  }

  changeYear() {
    this.state.year === '2017' ? this.setState({year:'2016', reports:[], loading:true}): this.setState({year:'2017'})
    setTimeout(() => this.fetchReports(), 2000)
  }

  fetchReports() {
    let reports = []
    reportRef.child(this.state.year).limitToFirst(this.state.count).once('value', s => {
      console.log(s.val())
      if(s.exists()) {
        Object.keys(s.val()).map(k => {
          reports.push(s.val()[k])
        })
      }
    }).then(() => {
      this.setState({
        loading:false,
        reports
      })
    })
  }

  render() {
    const reportTableStyle = {
      fontSize: '0.58rem'

    }
    if(this.state.loading) {
      return (
        <div className='row'> 
          fetching reports for {this.state.year} one second...
        </div>)
    }
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='card'>
              <div className='card-header'>
                Here are your last {this.state.count} recent sales from {this.state.year} <button className='btn btn-success btn-sm' onClick={this.changeYear}> See {this.state.year === '2017' ? '2016': '2017'} </button>
              </div>
              <div className='card-block'>
                <table style={reportTableStyle} className='table table-sm table-condensed'> 
                  <thead> 
                    <tr>
                      {Object.keys(this.state.reports[0]).map(k => {
                        if(k !== 'My Notes')
                          return (<th key={k}>{k}</th> )
                      })}
                    </tr>
                  </thead>
                  <tbody> 
                    {this.state.reports.map((report, index) => {
                      return (
                        <tr key={index}> 
                          {Object.keys(report).map(k => {
                            if(k !== 'My Notes')
                              return (<td key={k}> {report[k]} </td>)
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <ul className='pagination'> 
          <li className='page-link'onClick={this.handleClick}> Load 10 more
          </li> 
        </ul>
      </div>
    )
  }
}

export default Reports


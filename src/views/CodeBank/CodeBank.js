import React, { Component } from 'react'
import { codeBankRef } from '../../config'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

export default class CodeBank extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      loading:true,
      codes:[],
      startDate: moment()
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.saveCode = this.saveCode.bind(this)
  }

  componentDidMount() {
    console.log('code bank did mount')
    //setup our listeners for codes added and codes removed
    //and obviously save all current codes in state
    codeBankRef.once('value', s => {
      console.log(s.val())
      if(s.exists()) {
        console.log('snap exists', s.val())
        this.setState({
          loading:false,
          codes: Object.keys(s.val()).map(k => ({...s.val()[k], firebaseUrl:k}))
        })
        return
      }
      else {
        this.setState({
          loading:false
        })
      }
    })

    codeBankRef.on('child_added', s => {
      this.setState({
        codes: [...this.state.codes, {...s.val(), firebaseUrl:s.key}]
      })
    })

    codeBankRef.on('child_removed', s => {
      this.setState({
        codes: this.state.codes.filter(code => code.firebaseUrl !== s.key)
      })
    })

    codeBankRef.on('child_changed', s => {
      this.setState({
        codes: [...this.state.codes, {...s.val(), firebaseUrl:s.key}]
      })
    })
  }

  componentWillUnmount() {
    codeBankRef.off()
  }

  handleDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleCodeChange(newVal, itemIndex, key) {
    let code = this.state.codes[itemIndex]
    if(key === 'expirationDate') {
      newVal = moment(newVal).format()
    }
    let newCode = Object.assign(code, {[key]:newVal})
    console.log('got new code', newCode)
    let oldCodes = this.state.codes
    oldCodes[itemIndex] = newCode
    this.setState({
      editing:true,
      editedCode: newCode,
      codeIndex: itemIndex,
      codes: oldCodes

    })
  }

  saveCode(e) {
    e.preventDefault()
    const { firebaseUrl } = this.state.editedCode
    if(firebaseUrl === null) {
      codeBankRef.push(this.state.editedCode, () => {
        this.setState({
          editedCode: null,
          editing:false,
          codeIndex:null,
          codes: [...this.state.codes.filter((code, index) => this.state.codeIndex !== index)]
        })
      })
    }
  }
  removeCode(code) {
    codeBankRef.child(code.firebaseUrl).remove()
  }
  render() {
    console.log(this.state.codes)
    let codeStyle = {
      background:'#fff'
    }
    let addNewCodeStyle = {
      marginBottom:'5px'
    }

    if(this.state.loading) {
      return (
        <div className='animated fade-in'> 
          <h4 className='text-center'> Loading codes...</h4>
        </div>
      )
    }
    let codeNodes = this.state.codes.map((code, codeIndex) => {
      return (
        <tr key={codeIndex}> 
          <td> <input className='form-control' value={`${code.eventName}` } style={codeStyle} onChange={(e) => this.handleCodeChange(e.target.value, codeIndex, 'eventName')}/></td>
          <td> <input className='form-control' value={`${code.password}` } style={codeStyle} onChange={(e) => this.handleCodeChange(e.target.value, codeIndex, 'password')}/></td>
          <DatePicker className='form-control' selected={moment(code.expirationDate)} onChange={(e) => this.handleCodeChange(e, codeIndex, 'expirationDate')}/>
          <td> <button className='btn btn-warning' onClick={() => this.removeCode(code)}> Remove Code </button> </td>
        </tr>
      )
    })
    return (
      <div className='animated fade-in'> 
        <div className='row'> 
          <div className='col-lg-8'>
            <div className='card'> 
              <div className='card-block'>
                <table className='table table-sm table-condensed'> 
                  <thead> 
                    <tr> 
                      <th> Event Name </th>
                      <th> password </th>
                      <th> Expiration date </th>
                      <th> Remove Code </th>
                    </tr>
                  </thead>
                  <tbody> 
                    {codeNodes}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='col-lg-4'>
            <div style={addNewCodeStyle} className='row'>
              <button className='btn btn-primary' onClick={() => this.setState({
                codes: [...this.state.codes, {eventName:'placeholder', password:'placeholder', 'expirationDate': moment.now(), 'firebaseUrl': null}]
              })}> Add New Code</button>
            </div>
            <div className='row'>
              {this.state.editing ? <button className='btn btn-success' onClick={this.saveCode}> Done</button>: ''} 
            </div>
          </div>
        </div>
      </div>
    )
  }
}


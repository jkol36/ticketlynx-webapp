import moment from 'moment'
import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody} from 'reactstrap'
import 'react-select/dist/react-select.css';
import Select from 'react-select'
import { userRef } from '../../config'


export default class AdminPanel extends Component {
  constructor(props) {
    super(props)
    this.editUser = this.editUser.bind(this)
    this.onRemoveUser = this.onRemoveUser.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.buildOptions = this.buildOptions.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)

    this.state = {
      loading:true,
      users: null,
      selectedUser: null,
      showModal: false,
      value:[]
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  editUser(uid) {
    let user = this.state.users.filter(user => user.uid === uid)[0]
    this.setState({
      isEditing: true,
      userBeingEdited: user,
      value: Object.keys(user.allowableRoutes).map(k => ({label:k, value: k})),
      showModal:true
    })
  }

  onSubmitUserChanges(e) {
    e.preventDefault();
    if(!this.state.userBeingEdited) {
      this.setState({
        error: 'Tried to submit changes for a invalid user'
      })
    }
    userRef.child(this.state.userBeingEdited.uid).update(this.state.userChanges, () => {
      this.setState({
        message: 'user updated successfully'
      })
    })
  }

buildOptions() {
  let EnabledRoutes = Object.keys(this.state.userBeingEdited.allowableRoutes).map(k => ({label:k, value:k}))
}


  onRemoveUser(uid) {
    userRef.child(uid).remove(() => {
      this.setState({
        message: 'user removed successfully',
        users: this.state.users.filter(user => user.uid !== uid)
      })
    })
  }

  fetchUsers() {
    userRef.once('value', s => {
      if(s.exists()) {
        let users = Object.keys(s.val()).map(k => s.val()[k])
        this.setState({
          users,
          loading: false
        })
      }
    })
  }

  handleSelectChange(value) {
    let allowableRoutesForUser = {}
      value.split(',').forEach(route => {
        allowableRoutesForUser[route] = true
    })
    userRef
    .child(this.state.userBeingEdited.uid)
    .child('allowableRoutes')
    .set(allowableRoutesForUser)
    .then(() => {
      this.setState({
        value
      })
    })
  }



  componentDidMount() {
    this.fetchUsers()
  }

  render() {
    const options = [
      { label: 'Reports', value: 'reports' },
      { label: 'OnSaleList', value: 'onsalelist' },
      { label: 'Calculator', value: 'calculator' },
      { label: 'CodeBank', value: 'codebank' }
    ];
    console.log('got options', options)
    console.log('state', this.state)
    let tableHeaders
    if(this.state.loading) {
      return (
        <div className='animated fadeIn'> 
          <h4 className='text-center'> Fetching users </h4>
        </div>
      )
    }
    tableHeaders = Object.keys(this.state.users[0])
    let tableHeaderNodes = tableHeaders.map((text, index) => {
      if(text !== 'allowableRoutes') {
        return (
          <th> {text} </th>
        ) 
      }
    })
    let tableRows = this.state.users.map((user, index) => {
      let tableCellsForRow = Object.keys(user).map((k, index) => {
        if(k === 'createdAt') {
          return (
            <td key={index}> {moment(user[k]).format('dddd, MMMM Do YYYY,')} </td>
          )
        }
        else if(k !== 'allowableRoutes') {
          return (
            <td key={index}> {user[k]} </td>
          )
          
        }
      })
      return (
        <tr key={index}> 
          {tableCellsForRow}
          <td> <button onClick={() => this.onRemoveUser(user.uid)} className='btn btn-danger btn-sm'><i className='fa fa-x'/> Delete User</button> </td>
          <td> <button onClick={() => this.editUser(user.uid)} className='btn btn-warning btn-sm'><i className='fa fa-x'/> Edit User</button> </td>

        </tr>
      )
    })
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <Modal isOpen={this.state.showModal}> 
            <ModalHeader toggle={this.toggleModal} className={this.props.className}>
              {this.state.showModal ? `You are editing ${this.state.userBeingEdited.firstName}`: ''}
            </ModalHeader>
            <ModalBody>
                {this.state.showModal ?
                <div className='row'> 
                <div className='col-md-6 col-lg-6 col-sm-6'> 
                    <div className='card'>
                      <div className='card-header'> 
                        <strong> User form </strong>
                      </div>
                    <div className='card-block'>
                      {Object.keys(this.state.userBeingEdited).map(k => {
                        console.log('got key', k)
                        if(k !== 'allowableRoutes') {
                          return (
                            <div className='form-group'> 
                              <label for='testing'> {k} </label>
                              <input readOnly className='form-control' value={this.state.userBeingEdited[k]}/>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6'> 
                  <div className='card'> 
                    <div className='card-header'> 
                      <strong> Edit permissions for {this.state.userBeingEdited.firstName+this.state.userBeingEdited.lastName}</strong>
                    </div>
                    <div className='card-block'> 
                        {this.state.userBeingEdited ? 
                          <Select
                            label='testing'
                            multi={true}
                            simpleValue={true}
                            options={options}
                            onChange={this.handleSelectChange}
                            value={this.state.value}
                            >
                          </Select>: []}
                          <button className='form-control'> Done </button>
                    </div>
                  </div>
                  </div>
                </div>: ''}
            </ModalBody>
          </Modal>
          <div className='col-lg-12'> 
            <div className='card'> 
              <div className='card-block'>
                {this.state.message ? <p className='text-success'> {this.state.message} <i onClick={this.setState({message:null})}className='fa fa-remove'/> </p>: ''} 
                {this.state.error ? <p className='text-danger'> {this.state.error} <i className='fa fa-remove' onClick={() => this.setState({error: null})}/> </p>: ''}
                <table className='table table-bordered table-striped table-sm'> 
                  <thead>
                    { tableHeaderNodes } 
                    <th> Remove User </th>
                    <th> Edit User </th>

                  </thead>
                  <tbody> {tableRows} </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
       </div>
    )
  }
}
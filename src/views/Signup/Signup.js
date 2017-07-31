import firebase from 'firebase'
import { userRef } from '../../config'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.handleSignup = this.handleSignup.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onFirstNameChange = this.onFirstNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  }

  onEmailChange(e) {
    this.setState({
      email: e.target.value
    })

  }
  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    })

  }
  onFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    })
  }
  onLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    })
  }
  handleSignup(e) {
    e.preventDefault();
    console.log('handling signup')
    console.log(this.state)
    console.log('got user ref', userRef)
    if(this.state.firstName.length === 0) {
      this.setState({
        error: 'you did not specify a firstName'
      })
      return
    }
    else if(this.state.lastName.length === 0) {
      this.setState({
        error: 'You did not specify a last name'
      })
      return
    }
    else if(this.state.email.length === 0 || !this.state.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)) {
      this.setState({
        error: 'a valid email address is required'
      })
      return 
    }
    else if(this.state.password.length === 0) {
      this.setState({
        error: 'you did not specify a password'
      })
      return
    }
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(user => {
      let { firstName, lastName } = this.state
      let {uid, email } = user
      let newUser = {
        uid,
        email,
        createdAt: Date.now(),
        firstName,
        lastName
      }
      Object.keys(newUser).forEach(k => 
        localStorage.setItem(k, user[k])
      )
      localStorage.setItem('loggedIn', true)
      return userRef.child(uid).set(newUser)

    })
    .then(() => {
      return this.props.history.push('/reports')
    })
    .catch(error => {
      this.setState({
        error
      })
    })



  }
  render() {
    return (
    <div className='container'> 
      <div className='row offset-3'> 
        <div className='col-md-8 m-x-auto pull-xs-none vamiddle' style={{marginTop:'61px'}}> 
          <div className='card-block' style={{backgroundColor:'#fff'}}> 
            <h1> Register </h1>
            <p className='text-muted'> Create a new account </p>
            {this.state.error ? <p className='text-danger'> {this.state.error} </p>: null}
            <div className='input-group m-b-1'> 
              <span className='input-group-addon'> 
                <i className='icon-user'></i>
              </span>
              <input type='email' className='form-control' onChange={this.onEmailChange} placeholder='email'/> 
            </div>
            <div className='input-group m-b-2'> 
              <span className='input-group-addon'> 
                <i className='icon-lock'></i>
              </span>
              <input type='password' onChange={this.onPasswordChange} className='form-control' placeholder='password'/> 
            </div>
            <div className='input-group m-b-2'> 
              <span className='input-group-addon'> 
                <i className='icon-user'></i>
              </span>
              <input type='text' onChange={this.onFirstNameChange} className='form-control' placeholder='first name'/> 
            </div>
            <div className='input-group m-b-2'> 
              <span className='input-group-addon'> 
                <i className='icon-user'></i>
              </span>
              <input type='text' onChange={this.onLastNameChange} className='form-control' placeholder='last name'/> 
            </div>
            <div className='row' style={{'margin-top':'20px'}}> 
              <div className='col-xs-6'> 
                <button className='btn btn-primary p-x-2' onClick={this.handleSignup} style={{'margin-left':'10px'}}> Signup </button>
              </div>
              <div className='col-xs-6 text-xs-right'> 
                <button type='button' className='btn btn-link p-x-0'> Forgot Password </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
} 

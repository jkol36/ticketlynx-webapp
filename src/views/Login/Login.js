import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import { userRef } from '../../config'


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.state = {
      error: null
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
  handleLogin(e) {
    e.preventDefault();
    console.log('handling login')
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(user => userRef.child(user.uid).once('value', s => {
      if(s.exists()) {
        Object.keys(s.val()).forEach(k => {
          console.log('got key', k)
          localStorage.setItem(k, s.val()[k])
        })
        localStorage.setItem('loggedIn', true)
        this.props.history.push('reports')
      }
    }))
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
          <div className='card-group'> 
            <div className='card p-a-2'> 
              <div className='card-block'> 
                <h1> Login </h1>
                <p className='text-muted'> Log into your account </p>
                {this.state.error ? <p className='text-danger'> {this.state.error} </p>: null}
                <div className='input-group m-b-1'> 
                  <span className='input-group-addon'> 
                    <i className='icon-user'></i>
                  </span>
                  <input type='text' className='form-control' onChange={this.onEmailChange} placeholder='email'/> 
                </div>
                <div className='input-group m-b-2'> 
                  <span className='input-group-addon'> 
                    <i className='icon-lock'></i>
                  </span>
                  <input type='password' onChange={this.onPasswordChange} className='form-control' placeholder='password'/> 
                </div>
                <div className='row' style={{'margin-top':'20px'}}> 
                  <div className='col-xs-6'> 
                    <button className='btn btn-primary p-x-2' onClick={this.handleLogin} style={{'margin-left':'10px'}}> Login </button>
                  </div>
                  <div className='col-xs-6 text-xs-right'> 
                    <button type='button' className='btn btn-link p-x-0'> Forgot Password </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='card card-inverse card-primary p-y-3'> 
              <div className='card-block text-xs-center'> 
                <h2> Sign up</h2>
                <p> create your account </p>
                <Link to='/signup' className='btn btn-primary active m-t-1'> Register </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
} 

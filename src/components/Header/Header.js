import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom'
import { userRef } from '../../config'

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this)
    this.toggleNotification = this.toggleNotification.bind(this)
    this.approveUser = this.approveUser.bind(this)
    this.disproveUser = this.disproveUser.bind(this)
    this.state = {
      dropdownOpen: false,
      notificationOpen: false,
      usersPendingApproval: []
    };
  }

  componentDidMount() {
    userRef.orderByChild('pendingApproval').equalTo(true).once('value', s => {
      if(s.exists()) {
        this.setState({
          usersPendingApproval: Object.keys(s.val()).map(k => s.val()[k])
        })
      }
    })
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleNotification() {
    this.setState({
      notificationOpen: !this.state.notificationOpen
    })
  }

  logout(e) {
    Object.keys(localStorage).map(k => {
      localStorage[k] = null
    })
    localStorage.setItem('loggedIn', false)
  }

  approveUser(user) {
    userRef.child(user.uid).child('pendingApproval').set(false)
    userRef.child(user.uid).child('accountStatus').set('enabled')
    this.setState({
      usersPendingApproval: this.state.usersPendingApproval.filter(u => u.uid !== user.uid)
    })
  }
  disproveUser(user) {
    userRef.child(user.uid).child('pendingApproval').set(false)
    userRef.child(user.uid).child('accountStatus').set('disabled')
    this.setState({
      usersPendingApproval: this.state.usersPendingApproval.filter(u => u.uid !== user.uid)
    })
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    let userType = localStorage.getItem('userType')

    return (
      <header className="app-header navbar">
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarToggle}>&#9776;</button>
          </li>

        </ul>
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item d-md-down-none">
            {userType === 'admin' ? 
              <Dropdown isOpen={this.state.notificationOpen} toggle={this.toggleNotification}> 
              <button onClick={this.toggleNotification} className='nav-link dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded={this.state.notificationOpen}> 
                <i className='icon-bell'></i>
                {this.state.usersPendingApproval.length > 0 ? <span className='badge badge-pill badge-danger'> {this.state.usersPendingApproval.length} </span>: null}
              </button>
              <DropdownMenu className='dropdown-menu-right'> 
                <div className='dropdown-header text-xs-center'> 
                  <strong> {this.state.usersPendingApproval.length > 0 ? 'Accounts Pending Approval': 'No notifications' }</strong>
                </div>
                <div className='card'>
                  <div className='card-block'>
                    {this.state.usersPendingApproval.length > 2 ?<table className='table table-striped table-condensed table-sm'> 
                      <thead> 
                        <tr> 
                          <th> User </th>
                          <th> Approve </th>
                          <th> Disprove </th>
                        </tr>
                      </thead>
                      <tbody> 
                        {this.state.usersPendingApproval.map(user => {
                          return (
                            <tr> 
                              <td> {`${user.firstName} ${user.lastName}`} </td>
                              <td> <button onClick={() => this.approveUser(user)} className='btn btn-success btn-sm'> Approve </button> </td>
                              <td> <button onClick={() => this.disproveUser(user)} className='btn btn-danger btn-sm'> Disprove </button> </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>: ''}
                  </div>
                </div>
              </DropdownMenu>
            </Dropdown>: null
            }
          </li>
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <button style={{'margin-right': '27px'}} onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <span className="d-md-down-none">{`${localStorage.getItem('firstName')}  ${localStorage.getItem('lastName')}`}</span>
              </button>

              <DropdownMenu className="dropdown-menu-right">
                {userType === 'admin' ? <DropdownItem> <i className='fa fa-user'/> <Link to='/admin' className='btn btn-success'> Admin Panel </Link> </DropdownItem>: null}
                <DropdownItem><i className="fa fa-lock"/> <Link to='/login' className='btn btn-primary' onClick={this.logout}> Logout</Link></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </header>
    )
  }
}

export default Header;

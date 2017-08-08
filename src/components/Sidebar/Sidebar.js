import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { userRef } from '../../config'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allowableRoutes: []
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  componentDidMount() {
    let uid = localStorage.getItem('uid')
    if(uid) {
      userRef.child(uid).child('allowableRoutes').once('value', s => {
        if(s.exists()) {
          let allowableRoutes = Object.keys(s.val()).map(k => k)
          this.setState({
            allowableRoutes
          })
          
        }
      })
    }
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    const buildClassName = (route) => {
      switch(route) {
        case 'calculator':
          return 'fa fa-calculator'
        case 'reports': 
          return 'icon-speedometer'
        case 'onsalelist':
          return 'fa fa-list'
        case 'codebank':
          return 'fa fa-university'
        case 'research':
          return 'fa fa-book'
        case 'home':
          return 'fa fa-home'
      }
    }
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            {this.state.allowableRoutes.map(route => {
              return (
                <li className='nav-item'> 
                  <NavLink to={`/${route}`} className='nav-link' activeClassName='active'> <i className={buildClassName(route)}/> {route} </NavLink>
                </li>
              )
            })}
            
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;

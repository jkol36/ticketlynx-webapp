import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <NavLink to={'/reports'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Reports <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className={this.activeRoute("/onSaleList")}>
              <NavLink to={'/onSaleList'} className="nav-link" activeClassName="active"><i className="fa fa-list"></i> OnSaleList <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className={this.activeRoute('/codeBank')}> 
              <NavLink to={'/codeBank'} className='nav-link' activeClassName='active'> <i className='fa fa-university'></i> CodeBank <span className="badge badge-info">NEW</span></NavLink>
            </li>
            <li className={this.activeRoute('/Research')}> 
              <NavLink to={'/Research'} className='nav-link' activeClassName='active'> <i className='fa fa-book'/> Research <span className="badge badge-info">NEW</span> </NavLink>
            </li>
            <li className={this.activeRoute('/Calculator')}>
              <NavLink to={'/Calculator'} className='nav-link' activeClassName='active'> <i className='fa fa-calculator'/> Calculator <span className='badge badge-info'> NEW</span></NavLink>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;

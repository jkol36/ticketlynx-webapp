import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import MultiSelect from '../../components/multiselect'
import Dashboard from '../../views/Dashboard/'
import AdminPanel from '../../views/AdminPanel'
import PendingApproval from '../../views/PendingApproval'
import Reports from '../../views/Reports/'
import Calculator from '../../views/Calculator'
import AccountDisabled from '../../views/AccountDisabled'
import OnSaleList from '../../views/OnSaleList'
import SocialStats from '../../views/SocialStats'
import Research from '../../views/Research'
import CodeBank from '../../views/CodeBank'
import AccessDenied from '../../views/404'
import Charts from '../../views/Charts/'
import Widgets from '../../views/Widgets/'
import Buttons from '../../views/Components/Buttons/'
import Cards from '../../views/Components/Cards/'
import Forms from '../../views/Components/Forms/'
import Modals from '../../views/Components/Modals/'
import SocialButtons from '../../views/Components/SocialButtons/'
import Switches from '../../views/Components/Switches/'
import Tables from '../../views/Components/Tables/'
import Tabs from '../../views/Components/Tabs/'
import FontAwesome from '../../views/Icons/FontAwesome/'
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/'

import { reportRef, onSaleRef, userRef, signalingRef } from '../../config'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirected: false
    }
  }

  componentDidMount() {
    let loggedIn = localStorage.getItem('loggedIn')
    let uid = localStorage.getItem('uid')
    let accountStatus = localStorage.getItem('accountStatus')
    if(uid && this.state.redirected === false) {
      if(accountStatus === 'disabled') {
        this.setState({
          redirected: true
        })
        return this.props.history.push('AccountDisabled')
      }
      if(accountStatus === 'pending') {
        this.setState({
          redirected: true
        })
        return this.props.history.push('PendingApproval')
      }
      if(this.props.location.pathname === '/admin' && localStorage.getItem('userType') === 'admin') {
        this.setState({
          redirected:true
        })
        return this.props.history.push('/admin')
      }
      else {
        userRef.child(uid).child('allowableRoutes').once('value', s => {
          if(s.exists()) {
            let allowableRoutes = Object.keys(s.val()).map(k => k)
            if(allowableRoutes.indexOf(this.props.location.pathname.split('/')[1].toLowerCase()) === -1) {
              this.setState({
                redirected: true
              })
              return this.props.history.push('404')
            }
          }
        })
      }
    }
    if(!loggedIn) {
      console.log(this.props.location.pathname)
      if(this.props.location.pathname === '/signup') {
        return this.props.history.push('signup')
      }
      else {
        return this.props.history.push('login')
      }
    }

    //signal scrapers to run
    //signalingRef.push({lastRun: Date.now()})
  }

  componentDidUpdate() {
    console.log('app udating')
    console.log(this.state.redirected)
    console.log(localStorage)
    let uid = localStorage.getItem('uid')
    let accountStatus = localStorage.getItem('accountStatus')
    let {redirected} = this.state
    if(uid && redirected === false) {
      if(accountStatus === 'disabled') {
        this.setState({
          redirected: true
        })
        return this.props.history.push('AccountDisabled')
      }
      if(accountStatus === 'pending') {
        this.setState({
          redirected: true
        })
        return this.props.history.push('PendingApproval')
      }
      else {
        userRef.child(uid).child('allowableRoutes').once('value', s => {
          if(s.exists()) {
            let allowableRoutes = Object.keys(s.val()).map(k => k)
            if(this.props.location.pathname === '/admin' && localStorage.getItem('userType') === 'admin') {
              this.setState({
                redirected:true
              })
              return this.props.history.push('/admin')
            }
            if(allowableRoutes.indexOf(this.props.location.pathname.split('/')[1].toLowerCase()) === -1) {
              this.setState({
                redirected: true
              })
              return this.props.history.push('404')
            }
          }
        })
      }
    }

  }

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch>
                <Route path="/reports" name="reports" component={Reports}/>
                <Route path='/admin' name='admin' component={AdminPanel}/>
                <Route path="/components/buttons" name="Buttons" component={Buttons}/>
                <Route path="/components/cards" name="Cards" component={Cards}/>
                <Route path="/components/forms" name="Forms" component={Forms}/>
                <Route path="/components/modals" name="Modals" component={Modals}/>
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons}/>
                <Route path='/pendingapproval' name='PendingApproval' component={PendingApproval} />
                <Route path='/accountDisabled' name='AccountDisabled' component={AccountDisabled} />
                <Route path="/components/switches" name="Swithces" component={Switches}/>
                <Route path="/components/tables" name="Tables" component={Tables}/>
                <Route path="/components/tabs" name="Tabs" component={Tabs}/>
                <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome}/>
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons}/>
                <Route path="/widgets" name="Widgets" component={Widgets}/>
                <Route path="/charts" name="Charts" component={Charts}/>
                <Route path='/onSaleList' name='onSaleList' component={OnSaleList} />
                <Route path='/socialData' name='socialData' component={SocialStats} />
                <Route path='/codeBank' name='codeBank' component={CodeBank} />
                <Route path='/Research' name='Research' component={Research} />
                <Route path='/Calculator' name='Calculator' component={Calculator} />
                <Route path='/multiselect' name='multiselect' component={MultiSelect} />
                <Route path='/404' name='404' component={AccessDenied} />
                <Redirect from="/" to="/reports"/>
              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

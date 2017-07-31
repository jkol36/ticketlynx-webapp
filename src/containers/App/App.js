import React, { Component } from 'react';
import firebase from 'firebase'
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/'
import Reports from '../../views/Reports/'
import Calculator from '../../views/Calculator'
import OnSaleList from '../../views/OnSaleList'
import SocialStats from '../../views/SocialStats'
import Research from '../../views/Research'
import CodeBank from '../../views/CodeBank'
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

import { reportRef, onSaleRef, signalingRef } from '../../config'

class App extends Component {

  componentDidMount() {

    let loggedIn = localStorage.getItem('loggedIn')
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
                <Route path="/components/buttons" name="Buttons" component={Buttons}/>
                <Route path="/components/cards" name="Cards" component={Cards}/>
                <Route path="/components/forms" name="Forms" component={Forms}/>
                <Route path="/components/modals" name="Modals" component={Modals}/>
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons}/>
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

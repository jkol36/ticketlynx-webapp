import config from './config'
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';

import Login  from './views/Login'
import Signup from './views/Signup'
// Containers
import App from './containers/App/'

const history = createBrowserHistory();

ReactDOM.render((
  <HashRouter history={history}>
    <Switch>
      <Route path='/login' name='Login' component={Login}/>
      <Route path='/signup' name='Signup' component={Signup} />
      <Route path="/" name="Home" component={App}/>
    </Switch>
  </HashRouter>
), document.getElementById('root'))

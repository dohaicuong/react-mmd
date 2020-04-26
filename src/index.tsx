import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './index.css'

import * as Ammo from 'ammo.js'
// @ts-ignore
Ammo().then(ammo => global.Ammo = ammo)

const routes = [
  { exact: true, path: '/', component: React.lazy(() => import('./pages/SpeechReg')) },
  { exact: true, path: '/mmd', component: React.lazy(() => import('./pages/MMD')) },
]

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <React.Suspense fallback={null}>
          {routes.map((route, index) => <Route key={index} {...route} />)}
        </React.Suspense>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import App from './App/Containers/App'
import Test from './App/Containers/Test'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker'
import createStore from './App/Redux'
import { BrowserRouter, Route } from 'react-router-dom'

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path='/' component={App} />
        <Route path='/test' component={Test} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()

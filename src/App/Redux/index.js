import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    search: require('./LoginRedux').reducer
  })

  const appReducer = (state, action) => {
    return rootReducer(state, action)
  }

  return configureStore(appReducer, rootSaga)
}

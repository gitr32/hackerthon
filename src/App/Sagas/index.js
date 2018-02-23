import { all, takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'
// import FixtureAPI from '../Services/FixtureApi'
// import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

// import { } from '../Redux/SearchRedux'

/* ------------- Sagas ------------- */

// import { } from './SearchSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  let sagas = [
  ]
  yield all(sagas)
}

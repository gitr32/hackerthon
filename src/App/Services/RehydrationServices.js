import ReduxPersist from '../Config/ReduxPersist'
// import { LocalStorage } from 'react'
import { persistStore } from 'redux-persist'

const updateReducers = (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  // const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  
  try {
    const localVersion = localStorage.getItem('reducerVersion')

    if (localVersion !== reducerVersion) {
      console.tron.display({
        name: 'PURGE',
        value: {
          'Old Version:': localVersion,
          'New Version:': reducerVersion
        },
        preview: 'Reducer Version Change Detected',
        important: true
      })
      // Purge store
      // persistStore(store, config, startup).purge()
      localStorage.setItem('reducerVersion', reducerVersion)
    } else {
      // persistStore(store, config, startup)
    }
  } catch (e) {
    localStorage.setItem('reducerVersion', reducerVersion)
  }
    // persistStore(store, config, startup)
}

export default {updateReducers}

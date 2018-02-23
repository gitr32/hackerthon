import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import { LocalStorage } from 'react'

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '2.89',
  storeConfig: {
    storage: LocalStorage,
    // blacklist: ['nav', 'ui', 'register', 'search'], // reducer keys that you do NOT want stored to persistence here
    whitelist: [], // Optionally, just specify the keys you DO want stored to
    blacklist: ['message'],
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST

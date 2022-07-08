import { createStore } from 'redux'
import rootReducers from './reducers/'
import { Provider } from 'react-redux'
import React from 'react'
const store = createStore(
  rootReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
function DataProvider({ children }) {
  return <Provider store={store}>{children}</Provider>
}

export default DataProvider

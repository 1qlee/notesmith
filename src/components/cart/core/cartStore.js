import { configureStore } from '@reduxjs/toolkit'

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import { isBrowser } from '../../../utils/helper-functions'

import { updateFormattedTotalPrice, formatCurrencyString } from './entry'
import { reducer, actions, initialState } from './slice'

import { handleWarnings } from '../middleware/warnings'

export async function filterCart(cartDetails, filter) {
  const filteredCart = {}

  for (const sku in cartDetails) {
    const entry = cartDetails[sku]
    if (await filter(entry)) filteredCart[sku] = entry
  }

  return filteredCart
}

function noop() { }
function createNoopStorage() {
  return {
    getItem: noop,
    setItem: noop,
    removeItem: noop
  }
}

function createLocalStorage() {
  return {
    async getItem(key) {
      return window.localStorage.getItem(key)
    },
    async setItem(key, value) {
      return window.localStorage.setItem(key, value)
    },
    async removeItem(key) {
      return window.localStorage.removeItem(key)
    }
  }
}

export { reducer, actions, formatCurrencyString }

export function createShoppingCartStore(options) {
  options.shouldPersist = options.shouldPersist ?? true

  if (!isBrowser()) {
    return configureStore({
      reducer,
      preloadedState: { ...initialState, ...options }
    })
  }
  let storage
  if (isBrowser()) storage = options.storage || createLocalStorage()
  else storage = createNoopStorage()
  delete options.storage

  const persistConfig = {
    key: options.persistKey ?? 'root',
    version: 1,
    storage,
    whitelist: ['cartCount', 'totalPrice', 'formattedTotalPrice', 'cartDetails', 'cartQuantities'],
  }
  const persistedReducer = persistReducer(persistConfig, reducer)

  const newInitialState = { ...initialState, ...options }
  updateFormattedTotalPrice(newInitialState)

  return configureStore({
    reducer: options.shouldPersist ? persistedReducer : reducer,
    preloadedState: newInitialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredActionPaths: ['persist']
        }
      }).concat(handleWarnings)
  })
}
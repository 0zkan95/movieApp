"use client"
import { Provider, useDispatch } from 'react-redux';
import { store } from './store'; // Import your actual store instance
import axios from 'axios';
import AppInitializer from './AppInitializer';


axios.defaults.baseURL = "/api"

export default function StoreProvider({ children }) {

  return (
    <Provider store={store}>
       <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
};
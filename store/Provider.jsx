"use client"
import { Provider } from 'react-redux';
import { store } from './store'; // Import your actual store instance

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
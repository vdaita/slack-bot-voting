import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Vote from './pages/Vote.jsx'
import Create from './pages/Create.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './index.css'
import '@fontsource/inter';

const router = createBrowserRouter([
 {
  path: "/",
  element: <App/>
 },
 {
  path: "/vote/:postId",
  element: <Vote/>
 },
 {
  path: "/create",
  element: <Create/>
 }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

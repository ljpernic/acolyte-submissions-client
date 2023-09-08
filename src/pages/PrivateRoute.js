import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useGlobalContext } from '../context/appContext'

const PrivateRoute = ({ children, ...rest }) => {
  const { reader } = useGlobalContext()

  return (
    <Route
      {...rest}
      render={() => {
        return reader ? children : <Redirect to='/'></Redirect>
      }}
    ></Route>
  )
}
export default PrivateRoute

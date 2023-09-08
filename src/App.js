import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Dashboard, Login, Form, Delegate, Verarbeiten, Error, Submitted, PrivateRoute } from './pages';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <PrivateRoute path='/dashboard'>
          <Dashboard />
        </PrivateRoute>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/form'>
          <Form />
        </Route>
        <Route path='/submitted'>
          <Submitted />
        </Route>
        <Route path='/delegate'>
          <Delegate />
        </Route>
        <Route path='/verarbeiten/:id'>
          <Verarbeiten />
        </Route>
        <Route path='*'>
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

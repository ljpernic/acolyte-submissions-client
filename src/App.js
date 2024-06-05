import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, DashboardAll, Login, PasswordChange, FormFiction, FormPoetry, FormNonfiction, AddReader, Verarbeiten, Error, Submitted, PasswordChangeSuccess, PrivateRoute } from './pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <PrivateRoute path='/dashboard'>
          <DashboardAll />
        </PrivateRoute>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/form-fiction'>
          <FormFiction />
        </Route>
        <Route path='/form-poetry'>
          <FormPoetry />
        </Route>        
        <Route path='/form-nonfiction'>
          <FormNonfiction />
        </Route>
        <Route path='/submitted'>
          <Submitted />
        </Route>
        <Route path='/change-password-success'>
          <PasswordChangeSuccess />
        </Route>
        <PrivateRoute path='/add-reader'>
          <AddReader />
        </PrivateRoute>
        <PrivateRoute path='/change-password'>
          <PasswordChange />
        </PrivateRoute>
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

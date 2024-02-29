import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, DashboardClaimed, DashboardRecommended, DashboardUnclaimed, DashboardOld, Login, PasswordChange, FormFiction, FormPoetry, FormNonfiction, Delegate, Verarbeiten, Error, Submitted, PrivateRoute } from './pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <PrivateRoute path='/dashboard-claimed'>
          <DashboardClaimed />
        </PrivateRoute>
        <PrivateRoute path='/dashboard-recommended'>
          <DashboardRecommended />
        </PrivateRoute>
        <PrivateRoute path='/dashboard-unclaimed'>
          <DashboardUnclaimed />
        </PrivateRoute>
        <PrivateRoute path='/dashboard-old'>
          <DashboardOld />
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
        <PrivateRoute path='/delegate'>
          <Delegate />
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

//////// APP.JS OF THE CLIENT-SIDE CODE. MAIN COMPONENT OF THE REACT WEB APP, HANDLING ROUTING FOR DIFFERENT PAGES.

// BROWSERROTER ALIASED AS ROUTER ENABLES URL-BASED NAVIGATION. ROUTE DEFINES INDIVIDUAL ROUTES FOR SPECIFIC COMPONENTS. SWITCH 
// ENSURES ONLY ONE ROUTE IS RENDERED AT A TIME. 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, DashboardAll, Login, PasswordChange, FormFiction, FormPoetry, AddReader, Verarbeiten, Error, Submitted, PasswordChangeSuccess, PrivateRoute } from './pages';

// FUNCTIONAL COMPONENT TO SET UP ROUTING STRUCTURE OF THE ENTIRE APP. INSIDE THE SWITCH, EACH ROUTE IS DEFINED TO RENDER A  
// SPECIFIC PAGE COMPONENT BASED ON THE URL PATH. PRIVATEROUTE IS A CUSTOM COMPONENT THAT CONTROLS ACCESS TO CERTAIN ROUTES, 
// ALLOWING ONLY AUTHENTICATED USERS TO VIEW THESE PAGES. IF USER IS NOT AUTHENTICATED, THEY ARE REDIRECTED.
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

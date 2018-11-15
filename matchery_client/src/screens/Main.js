// IMPORT COMPONENTS
import React, { Component } from 'react';
import 'whatwg-fetch';
import Dashboard from './Dashboard'; // Dashboard component
import Login from './Login'; // Login component
import SignUp from './SignUp'; // SignUp component
import Matches from './Matches';
import Admin from './Admin/Admin'; // Admin component
import Judge from './Judge/Judge'; // Judge component
import Candidate from './Candidate/Candidate'; // Candidate component
import CreateEvent from './CreateEvent';

// IMPORT STYLING
import './Main.css'; // Header and background styling
// Note: Component-specific styling is imported through
// the components themselves

// MAIN APP COMPONENT CLASS
class App extends Component {

  // Component constructor
  constructor(props) {
    super(props);

    // Whenever a user clicks on a event they are part of, we need to fetch
    // certain data and push them to the candidate/judge/admin component.
    this.candidateChild = React.createRef();
    this.judgeChild = React.createRef();
    this.adminChild = React.createRef();

    this.state = {
      showLogin: true,
      showSignUp: false,
      showDropdown: false,
      showDashboard: false, // Main screen
      showAdmin: false,
      showJudge: false,
      showCandidate: false,
      showBackButton: false,
      showCreateEvent: false,
      candidateGroupList: [],
      events: { // TODO This will need to be pulled from the server
        'administrator' : [],
        'judge' : [],
        'candidate' : []
      },
    };
  }

  // Function to check if a session
  // already exists.
  componentDidMount() {
    const token = localStorage.getItem('session');
    if (token) {
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.fetchUserPermissions();
          }
        });
    }
  }

  // Function to fetch the user's
  // roles and events.
  fetchUserPermissions = () => {
    fetch('/api/account/getEvents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: localStorage.getItem('username')
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            events: {
              'administrator' : [],
              'judge' : [],
              'candidate' : []
            }
          });
          var username = localStorage.getItem('username');
          // Iterate through all the events
          json.eventRoles.forEach((event) => {
            switch(event.role) {
              case "Administrator":
              this.state.events['administrator'].push(event);
              break;
              case "Judge":
              this.state.events['judge'].push(event);
              break;
              case "Candidate":
              this.state.events['candidate'].push(event);
              break;
            }
          });
          this.setState({
            showLogin: false,
            showDashboard: true,
          });
        }
      });
  }

  // Function to logIn a user.
  handleLogIn = (e, username, password) => {
    e.preventDefault();
    // Login request
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        // alert(json.message);
        if (json.success) {
          localStorage.setItem('session', json.token);
          localStorage.setItem('username', json.username);
          this.fetchUserPermissions(e);
        }
      });
  }

  // Function to logOut the user.
  handleLogOut = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('session');
    if (token) {
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            // alert("Logged out!");
            this.setState({
              showLogin: true,
              showDashboard: false,
              showAdmin: false,
              showJudge: false,
              showCandidate: false,
              showBackButton: false,
              showCreateEvent: false,
              events: {
                'administrator' : [],
                'judge' : [],
                'candidate' : []
              },
            });
          }
        });
    }
  }

  // Function to open the signUp page.
  openSignUp = (e) => {
    e.preventDefault();
    this.setState({
      showSignUp: true,
    });
  }

  // Function to close the signUp page.
  closeSignUp = (e) => {
    e.preventDefault();
    this.setState({
      showSignUp: false,
    });
  }

  // Function to register a new user
  // in the database.
  handleSignUpSubmit = (e, firstName, lastName, email, username, password) => {
    //Insert in database
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password
      }),
    }).then(res => res.json())
      .then(json => {
          console.log('json', json);
          // alert(json.message);
        });
  }

  // Function to navigate from the dashboard
  // page to the admin page.
  dashboardToAdmin = (e, eventName) => {

    fetch('/api/account/getEventAdminInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventName: eventName
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.adminChild.current.setEventName(eventName);
          this.adminChild.current.setCandidateList(json.candidates);
          this.adminChild.current.setGroupList(json.groups);
          this.adminChild.current.setGroupJudgesDict(json.judges);

          this.setState({
            showDashboard: false,
            showAdmin: true,
            showBackButton: true,
          });
        }
        else {
          console.log(json.message);
        }
      });

  }

  // Function to navigate from the dashboard
  // page to the judge page.
  dashboardToJudge = (e, eventName, auditionName) => {

    fetch('/api/account/getSingleAudition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auditionName: auditionName
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.judgeChild.current.setEventName(eventName);
          this.judgeChild.current.setGroupName(auditionName);
          this.judgeChild.current.getList(json.audition.list);
          this.judgeChild.current.getNewList(json.audition.newList);
          this.judgeChild.current.getNotList(json.audition.notList);
          this.judgeChild.current.generateResults();

          this.setState({
            showDashboard: false,
            showJudge: true,
            showBackButton: true,
          });
        }
        else {
          console.log(json.message);
        }
      });
  }

  // Function to navigate from the dashboard
  // page to the candidate page for a specific event
  // given an eventName.
  dashboardToCandidate = (e, eventName) => {
    fetch('/api/account/getSingleEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        eventName: eventName
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log(json);
          this.candidateChild.current.setEventName(json.eventName);
          this.candidateChild.current.getList(json.list);
          this.candidateChild.current.getNotList(json.notList);
          this.candidateChild.current.generateResults();
          // Display the candidate page.
          this.setState({
            showDashboard: false,
            showCandidate: true,
            showBackButton: true,
          });
        }
        else {
          console.log(json.message);
        }
      });
  }

  closeCreateEvent = (e) => {
    this.setState({
      showCreateEvent: false,
    });
  }

  submitCreateEvent = (e, eventName, list) => {
    e.preventDefault();
    var nameArray = list.split(',');
    nameArray = nameArray.map(el => el.trim());

    fetch('/api/account/createEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventName: eventName,
        username: localStorage.getItem('username')
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.fetchUserPermissions();
        }
        else {
          console.log(json.message);
        }
      });

    this.setState({
      showCreateEvent: false,
    });
  }

  createEvent = (e) => {
    this.setState({
      showCreateEvent: true,
    });
  }

  // Render the Main application
  render() {

    // Styling constants for showing different screens
    const showLogin = this.state.showLogin ? {display:'block'} : {display:'none'};
    const showSignUp = this.state.showSignUp ? {display:'block'} : {display:'none'};
    const showDropdown = this.state.showDropdown ? {display:'block'} : {display:'none'};
    const showDashboard = this.state.showDashboard ? {display:'block'} : {display:'none'};
    const showAdmin = this.state.showAdmin ? {display:'block'} : {display:'none'};
    const showJudge = this.state.showJudge ? {display:'block'} : {display:'none'};
    const showCandidate = this.state.showCandidate ? {display:'block'} : {display:'none'};
    const showCreateEvent = this.state.showCreateEvent ? {display:'block'} : {display:'none'};

    const loggedIn = (this.state.showLogin || this.state.showSignUp) ? {display:'none'} : {display:'flex'};
    const notInDashboardButLoggedIn = (!this.state.showLogin && !this.state.showSignUp && !this.state.showDashboard) ? {display:'block'} : {display: 'none'};
    const inDashboardOrNotLoggedIn = (this.state.showLogin || this.state.showSignUp || this.state.showDashboard) ? {display:'block'} : {display: 'none'};
    const showBackButton = this.state.showBackButton ? {display:'block'} : {display:'none'};
    // TODO: make the Matchery logo clickable

    // Return the app frame (header and background)
    return (
      <div>
        <header className="header">
          <div className="header__container">
            <div
              className="header__logo-box"
              style={notInDashboardButLoggedIn}
              onClick={(e) => {this.setState({
                showBackButton: false,
                showDashboard: true,
                showJudge: false,
                showAdmin: false,
                showCandidate: false,
              })}}>
              Matchery
            </div>
            <div
              className="header__logo-box"
              style={inDashboardOrNotLoggedIn}>
              Matchery
            </div>
            <div style={loggedIn}
              onMouseEnter={(e) => {this.setState({showDropdown: true})}}
              onMouseLeave={(e) => {this.setState({showDropdown: false})}} 
              className="header__my-account-box header__my-account-box--drop-down-active">
              <div className="header__my-account-text">
                My Account
                <ion-icon class="header__down-arrow-icon" name="arrow-dropdown"></ion-icon>
              </div>
              <ul style={showDropdown} className="header__drop-down">
                <li className="header__drop-down-item">My Profile</li>
                <li onClick={(e) => {this.handleLogOut(e)}} className="header__drop-down-item">Logout</li>
              </ul>
            </div>
          </div>
        </header>
        <div style={showBackButton} onClick={(e) => {this.setState({
          showBackButton: false,
          showDashboard: true,
          showJudge: false,
          showAdmin: false,
          showCandidate: false,
        })}}>
          <div className="container-btn-back">
            <button className="btn-back">
              <ion-icon className="btn-back__icon" name="arrow-dropleft"></ion-icon>
              Back
            </button>
          </div>
        </div>
        <div style={showLogin}>
          <Login
            parentHandleLogin={this.handleLogIn}
            parentHandleSignup={this.openSignUp}
            fetchUserPermissions = {this.fetchUserPermissions}
          />
        </div>
        <div style={showSignUp}>
          <SignUp
            parentHandleLogin={this.handleLogIn}
            parentHandleSignup={this.openSignUp}
            parentHandleExitSignup={this.closeSignUp}
            parentHandleSignupSubmit={this.handleSignUpSubmit}
          />
        </div>
        <div style={showDashboard}>
          <Dashboard
            dashboardToAdmin={this.dashboardToAdmin}
            dashboardToJudge={this.dashboardToJudge}
            dashboardToCandidate={this.dashboardToCandidate}
            createEvent={this.createEvent}
            events={this.state.events}
          />
        </div>
        <div style={showAdmin}>
          <Admin
          ref={this.adminChild}
          />
        </div>
        <div style={showJudge}>
          <Judge
            ref={this.judgeChild}
          />
        </div>
        <div style={showCreateEvent}>
          <CreateEvent
            closeCreateEvent={this.closeCreateEvent}
            submitCreateEvent={this.submitCreateEvent}
          />
        </div>
        <div style={showCandidate}>
          <Candidate
            ref={this.candidateChild}
          />
        </div>
      </div>
    );
  }
}
export default App;

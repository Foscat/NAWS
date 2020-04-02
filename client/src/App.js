import React, { Component } from 'react';
import {  BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import Home from "components/pages/Home";
import WorkBench from 'components/pages/WorkBench';
import NoMatch from 'components/pages/NoMatch';
import NavBar from "components/parts/NavBar";
import API from 'utils/API';
import UserHome from 'components/pages/UserHome';
import { standard, dark, colorBlind } from "utils/styles"; //, dark, colorBlind
import MembersOnly from 'components/pages/MembersOnly';

// This is the router for react page components
class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            user: null,
            loading: false,
            token: localStorage.getItem("token"),
            loggedIn: false,
            logInUsername: "",
            logInPassword: "",
        }
    }

    componentDidMount(){
        // console.log("App mount state:", this.state);  // Comment in for degugging
    }

    componentDidUpdate(){
        console.log("App update state:", this.state);  // Comment in for degugging
    }

    // General handler for inputs thats value is to change the state
    // If state does not exsist it makes a state field with its name
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    }

    logInUser = () => {
        let s = this.state;

        // If one of the form fields has no value block submit
        if (!s.logInUsername ||!s.logInPassword) {
          // If failed block submit and show alert
          this.setState({
            title: "Error",
            text: "Please fill out all fields before attempting sign in.",
            show: true
          });
          return;
        }
        // Send field info to db using utils api call
        API.signInUser({
            username: s.logInUsername,
            password: s.logInPassword
        })
        // After form submits call function to get all users to see updated info and close model
        .then(res => {
            console.log("Sign in res",res.data);
            if(res.data.user){
                this.setState({show: false, user: res.data.user[0], loggedIn:true});
                localStorage.setItem("token",res.data.info);
            }
            else{
                console.log("No user found")
                return;
            }
        }).catch(err=>console.error("Sign in user error", err));
    }

    authenticate = async () => {
        API.currentUser({token: this.state.token})
        .then(res => {
            console.log("Authenticate res",res);
            if(res.data.length){
                if(res.data[0].theme)localStorage.setItem("colorTheme", res.data[0].theme);
                this.setState({ user: res.data[0], loggedIn: true });
                return res.data[0];
            }
            else return "Error"
        })
        .catch(err => {
            console.error("Authentication error", err);
            return err;
        })
    }

    signOutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("board_id");
        localStorage.removeItem("colorTheme");
        this.setState({ user: null, token:"", loggedIn: false });
        window.location.reload(false);
    };

    render() {
        const { loggedIn, logInPassword, logInUsername, user } = this.state;
        let home;
        let board;
        // If not logged in and no user is present
        if(!loggedIn || !user){
            home =  <Home 
                    logIn={this.logInUser} 
                    logInUsername={logInUsername}
                    logInPassword={logInPassword}
                    authenticate={this.authenticate}
                    handleChange={this.handleInputChange}
                    signOut={this.signOutUser}
                />
            board = <MembersOnly authenticate={this.authenticate}/>
        }
        // if logged in as a user
        else {
            home = <UserHome 
                    user={user} 
                    signOut={this.signOutUser} 
                    authenticate={this.authenticate}
                    />
            board= <WorkBench 
                    user= {user}
                    authenticate={this.authenticate} 
                    />
        }
        return (
            <div style={styles.app}>
                {/* Allows navbar to stay on all pages */}
                <NavBar user={user} logIn={this.logInUser} handleAppChange={this.handleInputChange} />
                <Router>
                    <div style={{width: "99%", padding: "30px 10px 0"}}>
                        <Switch>
                            {/* 'exact path' is how you set up html page routes */}
                            <Route exact path="/" render={() => home}  />
                            {/* Workbench is for writing new code to keep new parts isolated for easier developing */}
                            <Route exact path="/workbench"  render={()=>board} />
                            {/* If no url routes match show error page */}
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
    app: {
        backgroundColor: theme.colors.background, 
        height: "100%", 
        minHeight: "100vh"
    }
}

export default App;
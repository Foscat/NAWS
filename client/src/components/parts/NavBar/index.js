import React, { Component } from 'react';
import {NavLink, Popover, PopoverHeader, Button } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import UserForm from "components/parts/UserForm";
import LogIn from "components/parts/LogIn";
import SelectTheme from 'components/parts/SelectTheme';
import { standard, dark, colorBlind } from "utils/styles";
import API from 'utils/API'

class NavBar extends Component  {
    constructor(props){
        super(props);

        this.state = {
            show: false,
            title: "",
            text: "",
            settingsHov: false
        }
    }

    // Toggle settings badge on settings icon
    toggleSettingsHover = () => {
        this.setState({ settingsHov: !this.state.settingsHov });
    }

    // Check if cursor is still hovering over settings icon
    checkSettingsHover = () => {
        if(!this.state.settingsHov)this.setState({ settingsHov: true });
    }

    // Allows the users theme to be updated in db
    changeTheme = num => {
        this.setState({ show:false });
        API.updateUser(this.props.user._id, {theme: num}).then(res => {
        //   console.log("Update theme response", res);  // Comment in for degugging
            window.location.reload(false);
        }).catch(err=>console.error("Change theme error",err));
    }

    // Pop up for letting a user choose thier color theme when they are signed in
    selectThemeModal = () => {
        this.setState({ 
          title: "Select Color Theme",
          text: <SelectTheme  click={this.changeTheme}/>,
          show: true
         });
    }

    // Pop up with form to edit profile information
    editProfileModal = ()=> {
        this.setState({ 
          title: "Edit your profile information",
          text: <UserForm type="edit" user={this.props.user} hide={()=>this.setState({ show:false })} />,
          show: true
        });
    }

    // Pop up for  showing user edit options
    settingsMenuModal = () => {
        this.setState({ 
            title: "Profile Settings",
            text: <div>
                <div>
                    <p style={styles.link}>Theme</p>
                    <img onClick={() =>this.selectThemeModal()} className="m-3 bg-light p-2 rounded" 
                    src="./images/themeIcon.png" alt="select theme" />
                </div>

                <div>
                    <p style={styles.link}>Profile Info</p>
                    <img src="./images/Edit_Info_Icon.png" onClick={() =>this.editProfileModal()} 
                    className="m-3 bg-light p-2 rounded" alt="edit profile info"/>
                </div>
                </div>,
            show: true
         });
    }

    // If user is not  signed in have pop up so users can make an account
    signUpUserModal = () => {
        this.setState({ 
            show: true,
            title: "Join NAWS today!",
            text: <UserForm appChange={this.props.handleAppChange} autoLogIn={this.localLogin} type="create"/>
         });
    }

    // Log in user and close pop up
    localLogin = () => {
        this.props.logIn();
        this.setState({ show:false });
    }

    // Log in pop up
    logInPopUp = () => {
        this.setState({ 
            show: true,
            title:"Log In",
            text: <LogIn 
                    handleChange={this.props.handleAppChange}
                    logIn={this.localLogin}
                />
        });
    }

    render() {
        const { show, text, title } = this.state;
        return (
            <div style={styles.margin}>

                <SweetAlert
                    show={show}
                    title={title}
                    onConfirm={() => this.setState({ show: false })}
                    style={styles.center}
                    confirmBtnText="Close"
                    confirmBtnStyle={styles.btn2}
                >
                    <div style={styles.sweetBox}>
                        {text}
                    </div>
                </SweetAlert>

                {this.props.user ? (
                    <nav style={styles.body} className="navbar navbar-expand-lg fixed-top navbar-light">

                        <NavLink className="navbar-brand" href="/" style={styles.brand}>
                            <img src="./images/NAWS_logo.png" height="50%" width="50%" alt="logo" />
                        </NavLink>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav ">

                                <li className="nav-item">
                                    <img alt="toggle settings" onMouseEnter={this.toggleSettingsHover} id="settingsIcon" 
                                      onMouseOver={()=> this.checkSettingsHover()} onMouseLeave={this.toggleSettingsHover}
                                      onClick={()=>this.settingsMenuModal()} src="./images/Settings_Icon.png" 
                                    />
                                    <Popover placement="bottom" isOpen={this.state.settingsHov} 
                                      target={"settingsIcon"} toggle={this.toggleSettingsHover}>
                                        <PopoverHeader>Edit Settings</PopoverHeader>
                                    </Popover>
                                </li>

                            </ul>
                        </div>

                    </nav>
                ): ( // No user is propped in
                    <nav style={styles.body} className="navbar navbar-expand-lg fixed-top navbar-light">
                        <strong>
                            {/* // eslint-disable-next-line */}
                            <NavLink className="navbar-brand" href="/" style={styles.brand}>
                                <img src="./images/NAWS_logo.png" height="50%" width="50%" alt="logo" />
                            </NavLink>
                        </strong>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav ">
                                <li className="nav-item">
                                    <Button style={styles.btn} onClick={()=> this.logInPopUp()}>
                                        Log In
                                    </Button>
                                </li>
                                <li className="nav-item">
                                    <Button style={styles.btn} onClick={()=>this.signUpUserModal()}>
                                        Join Today!
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                )}

            </div>
        );
    }

}

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
    body: {
        backgroundColor: theme.colors.accent
    },
    link: {
        color: theme.colors.accent,
        fontWeight: "bold",
        fontFamily: "Georgia, serif"
    },
    brand: {
        color: theme.colors.background,
    },
    margin: {
        marginBottom: "3rem"
    },
    center: theme.classes.page,
    sweetBox: theme.classes.sweetBox,
    btn: {...theme.classes.confirmBtn, margin:"0 5px"},
    btn2: theme.classes.closeBtn
}

export default NavBar
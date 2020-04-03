import React, { Component } from 'react';
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import API from "utils/API";
import { standard, dark, colorBlind } from "utils/styles";

class UserForm extends Component {
    constructor(props){
        super(props);
        this.state={
            [`${this.props.type}Name`]: "",
            [`${this.props.type}Username`]: "",
            [`${this.props.type}Email`]: "",
            [`${this.props.type}Password`]: "",
            [`${this.props.type}PhoneNum`]: "",
        };
    };

    componentDidMount(){
        if(this.props.type === "edit"){
            this.setForEdit(this.props.user);
        }
    }

    componentDidUpdate(){
        // console.log("User form update state",this.state);  // Comment in for degugging
    }

    setForEdit = user => {
        this.setState({ 
            editName: user.name,
            editUsername: user.username,
            editEmail: user.email,
            editPassword: user.password,
            editPhoneNum: user.phone_num
         });
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        // console.log("name", name, "value", value);
        this.setState({ [name]: value });
        if(name === 'createUsername' || name === 'createPassword'){
            // console.log("caught in check");
            if(name === "createUsername")event.target.name = "logInUsername";
            else event.target.name = "logInPassword";
            this.props.appChange(event);
        }
    }

    handleSubmit = () => {
        let s = this.state;
        if(this.props.type === "create"){
            API.addUser({
                name: s.createName,
                username: s.createUsername,
                email: s.createEmail,
                password: s.createPassword,
                phone_num: s.createPhoneNum
            })
            .then(res=>{
                // console.log("Add user res",res);  // Comment in for degugging
                // Once a user has been added send them a email with welcom info
                API.newMemeberMessage({userInfo:{
                    name: s.createName,
                    username: s.createUsername,
                    email: s.createEmail,
                    password: s.createPassword
                }}).then(emailRes=>{
                    // console.log("New user email res", emailRes);
                    console.log("Email Sent");
                }).catch(err => console.error("New member email hit an error",err));
                // Auto log in
                this.props.autoLogIn();
                // Return state values to empty
                this.setState({ 
                    createName: "",
                    createUsername:"",
                    createEmail: "",
                    createPassword: "",
                    createPhoneNum: ""
                });
            })
            .catch(err=>console.error("Add user error", err));

        }
        else if(this.props.type === "edit" && this.props.user._id){
            // Update current user information
            API.updateUser(this.props.user._id,{
                name: s.editName,
                username: s.editUsername,
                email: s.editEmail,
                password: s.editPassword,
                phone_num: s.editPhoneNum
            })
            .then(res=>{
                // console.log("Edit user res",res); // Comment in for degugging
                console.log("user updated");
                this.setState({ 
                    editName: "",
                    editUsername:"",
                    editEmail: "",
                    editPassword: "",
                    editPhoneNum: ""
                });
                // Close modal that form is in on submit
                this.props.hide();
            })
            .catch(err=>console.error("Edit user err",err));
        }
        else console.error("Handle submit hit an error");
    };


    render() {
        const { type } = this.props;
        return (
            <Form style={styles.form}>
                <FormGroup className="form-group">
                    <Label style={styles.label} for={`${type}Name`}>Name</Label>
                    <Input style={styles.input} value={`${this.state[`${type}Name`]}`} type="text" name={`${type}Name`} 
                        onChange={this.handleInputChange} id={`${type}Name`} placeholder="Joe Buddy"/>
                </FormGroup>

                <FormGroup className="form-group">
                    <Label style={styles.label} for={`${type}Username`}>User Name</Label>
                    <Input style={styles.input} value={`${this.state[`${type}Username`]}`} type="text" name={`${type}Username`} 
                        onChange={this.handleInputChange} id={`${type}Username`} placeholder="JoeIzSooKewl"/>
                </FormGroup>

                <FormGroup className="form-group">
                    <Label style={styles.label} for={`${type}Email`}>Preferred Email</Label>
                    <Input style={styles.input} value={`${this.state[`${type}Email`]}`} type="email" name={`${type}Email`} 
                        onChange={this.handleInputChange} id={`${type}Email`} placeholder="joeBuddy@aol.com"/>
                </FormGroup>

                <FormGroup className="form-group">
                    <Label style={styles.label} for={`${type}Password`}>Password</Label>
                    <Input style={styles.input} value={`${this.state[`${type}Password`]}`} type="password" name={`${type}Password`} 
                        onChange={this.handleInputChange} id={`${type}Password`} placeholder="password2019"/>
                </FormGroup>

                <FormGroup className="form-group">
                    <Label style={styles.label} for={`${type}PhoneNum`}>Phone Number</Label>
                    <Input style={styles.input} value={`${this.state[`${type}PhoneNum`]}`} type="tel" name={`${type}PhoneNum`} 
                        onChange={this.handleInputChange} id={`${type}PhoneNum`} placeholder="0123456789"/>
                </FormGroup>

                <Button onClick={this.handleSubmit} style={styles.btn}>Submit</Button>
            </Form>
        )
    };
};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
    form: {
        color: theme.colors.main, 
        padding: 10
    },
    btn: theme.classes.confirmBtn,
    label: {
        color: theme.colors.accent
    },
    input: {
        backgroundColor: theme.colors.background, 
        color: theme.colors.accent, 
    }
}

export default UserForm;
import React, { Component } from 'react';
import { Row, Col, Button } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import UserForm from 'components/parts/UserForm';
import { standard } from "utils/styles";
import LogIn from 'components/parts/LogIn';
import FlexTron from 'components/parts/FlexTron';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
             // Modal attributes
             show: false,
             title: "Sweetie",
             text: null
        };
    };

    componentDidMount(){
        // If a token is present check authentication
        if(localStorage.getItem("token")){
            this.props.authenticate();
        }
    }

    componentDidUpdate(){
        // console.log("Home component update", this.state);
    }

    
    localLogin = () => {
        this.props.logIn();
        this.setState({ show:false });
    }

    logInPopUp = () => {
        this.setState({ 
            show: true,
            title:"Log In",
            text: <LogIn 
                    handleChange={this.props.handleChange}
                    logIn={this.localLogin}
                />
         });
    }

    signUpUserModal = () => {
        this.setState({ 
            show: true,
            title: "Join NAWS today!",
            text: <UserForm type="create" autoLogIn={this.localLogin} appChange={this.props.handleChange}/>
         });
    }

    render() {
        const { show, title, text } = this.state;
        return (
            <Row>
                {/* Generic model waiting for function to show and fill it */}
                <SweetAlert
                    show={show}
                    title={title}
                    onConfirm={() => this.setState({ show: false })}
                    confirmBtnText="Close"
                    confirmBtnStyle={styles.btn2}
                    style={styles.center}
                >
                    <div style={styles.sweetBox}>
                        {text}
                    </div>
                </SweetAlert>

                {/* Landing page should explain features and why a user should join*/}
                <FlexTron 
                        title="Welcome to NAWS!"
                        subtitle="A simple workflow service to keep things simple and on track."
                        className="mx-auto col-10 mt-3"
                        style={styles.btn}
                        contentStyle={styles.flexBody}
                    >
                        <p style={{margin:"10px 30px 10px 30px"}}>
                            Created in 2020, it was made to address the problems persented by modern workflow software.
                            In that it quickly becomes flooded with information. Too many columns of tasks. Each task is
                            filled with irrelevent information. This is a streamlined approach that gives users and thier 
                            teams only the important information.
                        </p>

                        <Button onClick={()=>this.signUpUserModal()} style={styles.btn}>Get Started &#10093;</Button>
                    </FlexTron>

                <Col className="m-1" sm="12">

                    <h3 style={styles.head2}>Made by a developer for developers</h3>
                    
                    <Row style={{justifyContent: "space-around"}}>
                        <div className="card col-5 mx-auto" style={styles.card2}>
                            <img className="card-img" src="./images/jefferson-santos-9SoCnyQmkzI-unsplash.jpg" alt="coder" />
                            <p style={styles.photoCredit}>Photo by Jefferson Santos on Unsplash</p>
                        </div>

                        
                        <div className="card col-5 mx-auto" style={styles.card2}>
                            <img style={{opacity:.5}} className="card-img" src="./images/marvin-meyer-SYTO3xs06fU-unsplash.jpg" alt="coding team" />
                            <p style={styles.photoCredit}>Photo by Marvin Meyer on Unsplash</p>
                        </div>
                    </Row>

                </Col>
                
            </Row>
        );
    };
};


const styles = {
    center: standard.classes.page,
    sweetBox:{ 
        backgroundColor: standard.colors.main,
        padding: 20,
        borderRadius: 10,
        maxHeight: "50vh", 
        minWidth: "50%", 
        overflow: "auto" 
    },
    flexBody:{
        backgroundColor: standard.colors.accent,
        color: standard.colors.background,
        margin: "10px",
        padding: "10px",
        borderRadius: ".5em"
    },
    head:{
        color: standard.colors.background,
        backgroundColor: standard.colors.secondary
    },
    head2:{
        width:"fit-content", 
        margin:"0 auto 10px", 
        color: standard.colors.accent
    },
    card: {
        backgroundColor: standard.colors.main, 
        color: standard.colors.background
    },
    card2:{
        border:"none", 
        backgroundColor:"transparent"
    },
    btn: standard.classes.confirmBtn,
    btn2: standard.classes.closeBtn,
    photoCredit:{
        color:"rgb(187, 225, 250, .2)",
        fontSize: "x-small"
    }
};

export default Home;
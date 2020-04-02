import React, { Component } from 'react';
import { Row, Col, Button } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import UserForm from 'components/parts/UserForm';
import { standard } from "utils/styles";
import LogIn from 'components/parts/LogIn';

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
        console.log("Home component update", this.state);
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
            text: <UserForm type="create"/>
         });
    }

    render() {
        const { show, title, text, userPool } = this.state;
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

                <Col className="m-1" sm="5">
                    <Button className="m-3" style={styles.btn} onClick={()=> this.logInPopUp()}>Log In</Button>
                </Col>

                <Col className="m-1" sm="5">
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
    head:{
        color: standard.colors.background,
        backgroundColor: standard.colors.secondary
    },
    card: {
        backgroundColor: standard.colors.main, 
        color: standard.colors.background
    },
    btn: standard.classes.confirmBtn,
    btn2: standard.classes.closeBtn
};

export default Home;
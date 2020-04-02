import React from 'react';
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import {standard} from 'utils/styles'

const LogIn = ({handleChange, logIn }) => {
    return(
        <Form>
            <FormGroup className="form-group">
                <Label style={styles.label} for={`logInUsername`}>User Name</Label>
                <Input style={styles.input} type="text" name={`logInUsername`} 
                    onChange={handleChange} id={`logInUsername`} placeholder="JoeIzSooKewl"/>
            </FormGroup>

            <FormGroup className="form-group">
                <Label style={styles.label} for={`logInPassword`}>Password</Label>
                <Input style={styles.input}type="password" name={`logInPassword`} 
                    onChange={handleChange} id={`logInPassword`} placeholder="password2019"/>
            </FormGroup>

            <Button style={styles.btn} onClick={()=> logIn()}>Log In</Button>
        </Form>
    );
};



const styles = {
    form: {
        color: standard.colors.main, 
        padding: 10
    },
    btn: standard.classes.confirmBtn,
    label: {
        color: standard.colors.accent
    },
    input: {
        backgroundColor: standard.colors.background, 
        color: standard.colors.accent, 
    }
}

export default LogIn;
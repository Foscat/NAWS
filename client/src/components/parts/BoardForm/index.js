import React, { Component } from 'react';
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import API from "utils/API";

class BoardForm extends Component {
    constructor(props){
        super(props);
        this.state={
            board: this.props.board,
            // By proping the type into the form it changes the state dynamically
            [`${this.props.type}Title`]: "",
            [`${this.props.type}Description`]: ""
        };
    };

    componentDidMount(){
        // console.log("BoardForm mount state", this.state);  // Comment in for degugging

        // If the form is set to edit format take propped in board values to give defaults for input fields
        if(this.props.type==="edit")this.setToEdit(this.props.board);
    }

    componentDidUpdate(){
        // console.log("BoardForm update state",this.state);  // Comment in for degugging
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        this.setState({ [name]: value });
    }

    setToEdit = board => {
        this.setState({ 
            editTitle: board.title,
            editDescription: board.description
        });
    }

    // When the submit button is clicked on the form check what type of form it is and create or edit accordingly
    handleSubmit = () => {
        let s = this.state;
        // Based on the prop value of type will decide what function to call on submit.
        if(this.props.type === "create"){
            API.createBoard({
                title: s.createTitle,
                description: s.createDescription,
                _adminId: this.props.adminId
            })
            .then(res=>{
                console.log("Create board res", res);
                this.setState({ 
                    createTitle: "",
                    createDescription:"",
                });
                this.props.refresh();
            })
            .catch(err=>console.error("Add user error", err));
        }
        // If type is edit it will update a board by its id with the new info
        else if(this.props.type === "edit" && this.props.board._id){
            API.updateBoard(this.props.board._id,{
                title: s.editTitle,
                description: s.editDescription,
            })
            .then(res=>{
                console.log("Edit user res",res);
                this.setState({ 
                    editTitle: "",
                    editDescription:"",
                });
                this.props.refresh();
            })
            .catch(err=>console.error("Edit user err",err));
            
        }
        else console.error("Handle submit hit an error");
    };

    render() {
        const { type } = this.props;
        return (
            <Form>
                <FormGroup className="form-group">
                    <Label for={`${type}Title`}>Title</Label>
                    <Input value={`${this.state[`${type}Title`]}`} type="text" name={`${type}Title`} 
                        onChange={this.handleInputChange} id={`${type}Title`} placeholder="Joe Buddy"/>
                </FormGroup>

                <FormGroup className="form-group">
                    <Label for={`${type}Description`}>Description</Label>
                    <Input value={`${this.state[`${type}Description`]}`} type="text" name={`${type}Description`} 
                        onChange={this.handleInputChange} id={`${type}Description`} placeholder="JoeIzSooKewl"/>
                </FormGroup>

                <Button onClick={this.handleSubmit} color="success">Submit</Button>
            </Form>
        )
    };
};


export default BoardForm;
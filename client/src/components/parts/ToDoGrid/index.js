import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Popover, PopoverHeader } from 'reactstrap';
import SweetAlert from "react-bootstrap-sweetalert";
import ToDo from "components/parts/ToDo";
import API from 'utils/API';
import { standard, dark, colorBlind } from "../../../utils/styles"; 

class ToDoGrid extends Component {
    constructor(props){
        super(props);

        this.state = {
            id: localStorage.getItem("board_id"),
            // Task form hover and dropdown controller
            makeTask:false,
            taskFormHov: false,
            // Check if board needs to be saved 
            unsavedChanges: false,
            // Create todo fields
            titleInput: "",
            descriptionInput: "",
            priorityInput: "",
            // Edit todo fields
            edit_t: "",
            edit_d: "",
            edit_p: "",
            // Start with workbench items that can be modified before a save
            icebox: this.props.icebox,
            started: this.props.started,
            done: this.props.done,
            // Drag card controls
            draggedTask: {},
            index: 0,
            orgin: "",
            hover: false,
            // Modal Controls
            show: false,
            title: "Sweetie",
            text: ""
        };
    };

    componentDidMount(){
        // console.log("ToDoGrid mount state", this.state);  // Comment in for degugging
    };

    componentDidUpdate(){
        // console.log("ToDoGrid update state", this.state);  // Comment in for degugging
    };

    // When a new task is made make a object with form info and add it to first list.
    submitter = () => {
        console.log("Submit state", this.state)
        this.setState({ 
          icebox: [{
              title:this.state.titleInput,
              text: this.state.descriptionInput,
              priority: this.state.priorityInput
            }, ...this.state.icebox]
         });
        //  Once added to the list clear vlaues so if a new task is made old info is not there
        this.setState({ titleInput:"",descriptionInput:"", priorityInput:"", unsavedChanges: true});
    }

    // For handling form input changes. The name of the input field will make or update the state.
    handleInputChange = event => {
        const {name, value} = event.target;
        this.setState({ [name]: value} );
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    // When a card is dropped into a column
    handleDrop = (event, type) => {
        event.preventDefault();
        const { icebox, started, done, draggedTask, orgin, index} = this.state;
        // Whatever column the card was originally in splice it from the array
        if(orgin===1){
            started.splice(index,1);
        }
        else if(orgin===2){
            done.splice(index,1);
        // Have icebox serve as a catch all
        }else icebox.splice(index,1);

        // Whatever column the card is being dropped into add it tothe end of the state value for that column
        if(type==="icebox"){
            this.setState({ 
                icebox: [ ...icebox, draggedTask ],
                draggedTask: {},
                unsavedChanges: true
            });
        }
        else if(type==="started"){
            this.setState({ 
                started: [ ...started, draggedTask ],
                draggedTask: {},
                unsavedChanges: true
            });
        }
        else if(type==="done"){
            this.setState({ 
                done: [ ...done, draggedTask ],
                draggedTask: {},
                unsavedChanges: true
            });
        }
        else{
            return;
        }
    }

    // Change hover state if over a draggable card
    toggleHover = () => {
        this.setState({ hover: !this.state.hover });
    }

    // Check if cursor is over draggable card
    checkHover = () => {
        if(!this.state.hover)this.setState({ hover: true });
    }

    // When a card is dragged take its info and apply it to the state
    dragMe = (todo, id, orgArr) => {
        this.setState({ draggedTask: todo , index: id, orgin: orgArr});
    }

    // Once a user is done making and moving cards they can save the board
    saveBoard = () => {
        let s = this.state;
        API.updateBoard(s.id, {
            icebox: s.icebox,
            started: s.started,
            done: s.done
        }).then(res=>{
            console.log("Update board res", res.data);
            this.setState({ unsavedChanges: false });
        }).catch(err=>{
            this.setState({ show:true, title:"Save board error", text:"Something went wrong with your save request. Plaese try again" });
        });
    }

    // If a user wants to edit some value on a todo get what array is it in and what index is it
    editToDo = (origin, index)=> {
        const { icebox, started, done, edit_t, edit_d, edit_p} = this.state;
        let changeList;
        console.log("Edit to do", origin, index);

        // Replace previous values with new values at origin array and index
        if(origin === 0){
            changeList = icebox;
            changeList[index] = {title:edit_t, text:edit_d, priority:edit_p};
            this.setState({ icebox: changeList });
        }
        else if(origin === 1){
            changeList = started;
            changeList[index] = {title:edit_t, text:edit_d, priority:edit_p};
            this.setState({ started: changeList });
        }
        else if(origin === 2){
            changeList = done;
            changeList[index] = {title:edit_t, text:edit_d, priority:edit_p};
            this.setState({ done: changeList });
        }
        else{alert("Something went wrong with your request")}
        // Set values back to empty so that if used again old values are not there
        this.setState({ edit_t:"", edit_d:"", edit_p: "", show: false, unsavedChanges: true });
    }

    // When a user clicks the edit button on a todo take its origin list, it's indexx in that list and the todo info
    editToDoModal = (list, index, todo) => {
        // Set edit todo state values with current values
        this.setState({ edit_t:todo.t,edit_d:todo.d,edit_p:todo.p });
        console.log("EDIT TODO",list, index, todo);
        this.setState({ 
            show: true,
            title: "Edit this todo",
            text: <Form style={styles.formRow}>

                <FormGroup>
                    <Label for="edit_t">Title</Label>
                    <Input className="form-control" name="edit_t" type="text" defaultValue={todo.t}
                        onChange={this.handleInputChange} placeholder="Title" />
                </FormGroup>

                <FormGroup>
                    <Label for="edit_d">Task Body</Label>
                    <Input className="form-control" name="edit_d" type="text" defaultValue={todo.d}
                        onChange={this.handleInputChange} placeholder="Task Body" />
                </FormGroup>
                
                <FormGroup>
                    <Label for="edit_p">Select Priority Level</Label>
                    <Input type="select" name="edit_p" id="edit_p" defaultValue={todo.p} onChange={this.handleInputChange}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    </Input>
                </FormGroup>
                <Button onClick={()=> this.editToDo(list, index)}>Submit</Button>
            </Form>
         });
    }

    // Loop over task arrays and map out components
    renderToDos = (list, pro) => {
        console.log("todo list", list, pro);
        return(
            <div>
                {list.length ? (
                    list.map((todo,i)=>{
                        return(
                            <ToDo 
                                key={i}
                                id={i}
                                todo={todo}
                                onClick={() =>this.dragMe(todo,i,pro)}
                                progress={pro}
                                hov={this.toggleHover}
                                check={this.checkHover}
                                edit={this.editToDoModal}
                                deleteCard={this.deleteToDoModal}
                            />
                        )
                    })
                ) : null}
            </div>
        );
    }

    // When a user chooses to delete a task
    deleteToDo = (origin, index)=> {
        const { icebox, started, done } = this.state;
        let changeList;
        console.log("Edit to do", origin, index)
        if(origin === 0){
            changeList = icebox;
            changeList.splice(index,1);
            this.setState({ icebox: changeList });
        }
        else if(origin === 1){
            changeList = started;
            changeList.splice(index,1);
            this.setState({ started: changeList });
        }
        else if(origin === 2){
            changeList = done;
            changeList.splice(index,1);
            this.setState({ done: changeList });
        }
        else{alert("Something went wrong with your request")}

        this.setState({show: false });
    }

    // Make user confirm that they want to delete a task
    deleteToDoModal = (origin, index) => {
        this.setState({ 
            title: "Delete this todo?",
            text: <Button className="p-3" onClick={() =>this.deleteToDo(origin,index)} style={styles.btn}>Yes</Button>,
            show: true
         });
    }

    // Swich task form hover on and off
    toggleTaskFormHover = () => {
        this.setState({ taskFormHov: !this.state.taskFormHov });
    }

    // Check if cursor is over make task header
    checkTaskFormHover = () => {
        if(!this.state.taskFormHov)this.setState({ taskFormHov: true });
    }

    render(){
        // Deconstruct state values
        const { titleInput, descriptionInput, priorityInput, icebox, started, 
            done, show, text, title, makeTask, taskFormHov, hover, unsavedChanges} = this.state;
        // Change cursor based on hover state
        let cursorStyle;
        if(hover) cursorStyle = {cursor: "grab"}
        return(
            <div style={this.props.style} className={this.props.className}>
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
                <Row>
                    <Col className="mx-auto">
                        <div style={{maxWidth:"800px",minWidth:"250px", margin: "0 auto"}}>
                            <Row style={styles.formRow} className="p-1 rounded">
                                <h3 onClick={()=>this.setState({ makeTask: !makeTask })} 
                                    className="ml-2" 
                                    id="makeTaskHead"
                                    onMouseEnter={this.toggleTaskFormHover} 
                                    onMouseOver={()=> this.checkTaskFormHover()} 
                                    onMouseLeave={this.toggleTaskFormHover}>
                                    Make a new task
                                </h3>
                                <Popover placement="right" isOpen={taskFormHov} target={"makeTaskHead"} toggle={this.toggleTaskFormHover}>
                                    <PopoverHeader>{(taskFormHov && makeTask) ? "Close" : "Open" } Task Form</PopoverHeader>
                                </Popover>
                                {/* If the user has clicked that they want to make a task this form will drop down. */}
                                {makeTask ? (
                                    <Form  className="col-11 mx-auto">
                                        <FormGroup>
                                            <Label for="titleInput">Title</Label>
                                            <Input style={styles.input} className="form-control m-1" name="titleInput" type="text" 
                                                value={titleInput} onChange={this.handleInputChange} />
                                        </FormGroup>
                                    
                                        <FormGroup>
                                            <Label for="descriptionInput">Description</Label>
                                            <Input style={styles.input} className="form-control m-1" name="descriptionInput" type="textarea" rows="3"
                                                value={descriptionInput} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup className="mx-auto">
                                            <Label for="priorityInput">Select Priority Level</Label>
                                            <Input type="select" name="priorityInput" value={priorityInput} onChange={this.handleInputChange}>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            </Input>
                                        </FormGroup>
                                        <Button style={styles.btn} className="mb-2" onClick={()=> this.submitter()}>Submit</Button>
                                    </Form>
                                ) : null}
                            </Row>
                        </div>
                        <Row style={{justifyContent:"space-around"}}>
                            <Button id="saveBoardBtn" style={ unsavedChanges ? styles.btn2 : styles.btn} 
                            className="m-1" onClick={()=>this.saveBoard()}>
                                Save Board
                            </Button>
                            <Popover placement="right" isOpen={unsavedChanges} target={"saveBoardBtn"} toggle={this.toggleTaskFormHover}>
                                <PopoverHeader>Save your changes</PopoverHeader>
                            </Popover>
                        </Row>
                    </Col>
                </Row>
                <Row style={styles.spread}>
                    <Col sm="4"
                        onDrop={event => this.handleDrop(event,"icebox")}
                        onDragOver={event => this.handleDragOver(event)}
                        style={{...cursorStyle, ...styles.col}}
                    >
                        <h4 style={styles.hText} className="text-center m-1">Icebox</h4>
                        {this.renderToDos(icebox,0)}
                    </Col>
                    <Col sm="4"
                        onDrop={event => this.handleDrop(event,"started")}
                        onDragOver={event => this.handleDragOver(event)}
                        style={{...cursorStyle, ...styles.col}}
                    >
                        <h4 style={styles.hText} className="text-center m-1">Started</h4>
                        {this.renderToDos(started, 1)}
                    </Col>
                    <Col sm="4"
                        onDrop={event => this.handleDrop(event,"done")}
                        onDragOver={event => this.handleDragOver(event)}
                        style={{...cursorStyle, ...styles.col}}
                    >
                        <h4 style={styles.hText} className="text-center m-1">Done</h4>
                        {this.renderToDos(done,2)}
                    </Col>
                </Row>
            </div>
        );
    };
};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
    spread: {
        justifyContent: "space-around",
        margin: "0 auto"
    },
    col: {
        padding: 15,
    },
    center: theme.classes.page,
    sweetBox: theme.classes.sweetBox,
    btn: theme.classes.confirmBtn,
    btn2: theme.classes.closeBtn,
    formRow: {
        backgroundColor: theme.colors.main, 
        color: theme.colors.accent, 
    },
    input: {
        backgroundColor: theme.colors.accent, 
        color: theme.colors.background, 
    },
    hText: {
        color: theme.colors.secondary
    }
}

export default ToDoGrid;
import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'; 
import { Row, Col, Button } from 'reactstrap';
import ColabSearch from "components/parts/ColabSearch";
import TextCard from "components/parts/TextCard";
import FlexTron from "components/parts/FlexTron"
import ToDoGrid from 'components/parts/ToDoGrid';
import { standard, dark, colorBlind } from "utils/styles"; //dark, colorBlind
import API from 'utils/API';

class WorkBench extends Component {

  constructor(props) {
    super(props);

    this.state={
      user: this.props.user,
      board: {},
      isAdmin: false,

      // Modal attrs
      title: "",
      text: "",
      show: false
    }
  }

  componentDidMount(){
    console.log("Workbench mount state:", this.state);
    // When component loads call backend for board to show
    this.giveBoard();
  }

  componentDidUpdate(){
    console.log("Workbench update state:", this.state);
  }

  // General handler for inputs thats value is to change the state
  // If state does not exsist it makes a state field with its name
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  // Handle call for board to load and check isf user is admin of board
  giveBoard =()=>{
    // Use local storage to retrieve id that was set on userhome
    API.getBoard(localStorage.getItem("board_id")).then(res=>{
        // console.log("Get board by id res:", res.data); //Comment back in for degugging
        let b_id = localStorage.getItem("board_id");
        // If user id and board admin id do not match
        if(res.data._adminId !== this.props.user._id){
          console.log("User is not board admin");
          // If a user found change this to true to pass check
          let found = false
          // Check if user has this board as on of thier colab boards
          this.props.user.colabBoards.forEach(board=>{
            if(board.id === b_id){
              // If the user has been given access to the board change found to true
              found = true;
              console.log("Board is part of users colabs");
              this.setState({ board:res.data, });
              // If the currently saved title value is differant change it to match the new value
              if(board.title !== res.data.title){
                // console.log("Saved title is differant. Update values",board.title, res.data.title);
                board.title = res.data.title;
                API.updateUser(this.props.user._id,{colabBoards:this.props.user.colabBoards})
                .then(updatedUser=> console.log("Updated user res", updatedUser))
                .catch(updateUserErr=>console.error("Update user error", updateUserErr));

                // Show popup message informing user of title change
                this.setState({ 
                  show:true,
                  title: "Board title changed",
                  text: <div style={styles.lightText}>
                    <p className="text-center">
                      This board title was changed by the admin. It will now appear in your collaborator boards as...
                    </p>
                    <strong>{res.data.title}</strong>
                  </div>
                 });
              }
              // End loop once data found and sent
              return;
            }
          });
          // If a user gets to a board that they are not admins of or an authorized collaborator
          if(!found){
            this.setState({ 
              show: true,
              title:"You are not authorized",
              text: <a href="/"><Button>Go Home</Button></a>
             });
          };
        }
        // If the user id matches the _adminId of the board give admin privileges
        else{
          console.log("User is admin of board");
          this.setState({ board:res.data, isAdmin: true });
        };
      }).catch(err=>console.error("Get board by id hit an error",err));
  } // End give board

  // If a user is an admin a button willbe present that allows them to search for users in db to add as collaborators.
  addCollaboratorModal = (currentColabs,boardId, boardTitle) => {
    this.setState({ 
      title: "Add a collaborator",
      text: <ColabSearch 
              admin={this.state.user.name}
              currentColabs={currentColabs} 
              boardId={boardId}
              boardTitle={boardTitle}
              refresh={()=>{
                this.giveBoard();
                this.setState({ show:false });
              }} 
            />,
      show: true
    });
  }

  // If a user is an admin they can remove collaborators from the board
  removeColab = (remColab, allColabs, boardId) => {
    // Slice single colab from array
    let old = allColabs.splice(remColab,1)
    // console.log("Removed colab", old); // Comment in for degugging

    // Remove collaborator rights from a board from user
    API.removeColabRights(old[0].id,boardId).then(res=> {
      // console.log("remColabRights res", res); // Comment in for degugging
    }).catch(err=>console.error("Remove colab rights error",err));

    // Send notification to user that they have been removed as a collaborator from this board
    API.boardColabRemovalNotification({boardInfo:{
      admin: this.state.user.name,
      colabName: old[0].name,
      colabEmail: old[0].email
    }}).then(remEmailRes=>console.log("Remove colab email", remEmailRes))
    .catch(err => console.error("Send removal notification error",err));

    // Update board with updated list of collaborators
    API.updateBoard(boardId,{collaborators:allColabs}).then(res=>{
      console.log("Remove collaborator response", res);
      this.setState({ show:false });
      this.giveBoard();
    }).catch(err=>console.error("Remove colab on board error",err));

  }

  // As user if they want to remove collaborator
  colabInfoModal = (position, all, boardId) => {
    this.setState({ 
      title: `${all[position].username}'s info`,
      text: <TextCard subtitle="Remove this collaborator?">
        <Button
          style={styles.btn}
          onClick={()=>this.removeColab(position,all,boardId)}
        >
          Yes
        </Button>
        <Button 
          onClick={()=>this.setState({ show:false })}
          style={styles.btn2}
        >
          No
        </Button>
      </TextCard>,
      show: true
     });
  };

  render() {
    // Deconstruct state object
    const { user, board, show, text, title, isAdmin } = this.state
    return (
      <Row style={styles.box} className="mt-5">

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

        <Col sm="10" className="mx-auto">
          <FlexTron
            style={styles.header}
            titleStyle={styles.headTitle}
            title={board.title}
            subtitle={board.description}>
              {this.state.user ? (
                <h5 style={styles.admin} className="text-center">
                  Signed in as: {user.username}
                </h5>
              ): null}

              {(board.collaborators && isAdmin) ? (
                <div>
                  <h6>Collaborators</h6>
                  <ul>
                    {board.collaborators.map((colab, id)=> {
                      return(
                        <li onClick={()=>this.colabInfoModal(id, board.collaborators, board._id)} key={id}>
                          {colab.username}
                        </li>
                      )
                    })}
                  </ul>
                  <div>
                  <Button onClick={()=>this.addCollaboratorModal(board.collaborators, board._id, board.title)} style={styles.btn}>
                    Add Collaborator
                  </Button>
                  </div>
                </div>
              ) : null}
              
            </FlexTron>
        </Col>

        {this.state.board.icebox ? (
          <ToDoGrid 
          className="col-12"
          icebox={board.icebox}
          started={board.started}
          done={board.done}
        />
        ): null}
        
      </Row>
   );
  }

}

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;
const styles = {
  center: theme.classes.page,
  sweetBox:theme.classes.sweetBox,
  header: {
    backgroundColor:  theme.colors.main,
    border: `2px solid ${ theme.colors.accent}`,
  },
  headTitle: {
    backgroundColor: theme.colors.background,
    color: theme.colors.secondary,
    borderRadius: 10,
    padding: 20
  },
  admin: {
    color: theme.colors.accent, 
    fontWeight: 600
  },
  box: {
    backgroundColor:  theme.colors.background,
    justifyContent: "center"
  },
  btn: theme.classes.confirmBtn,
  btn2: theme.classes.closeBtn,
  lightText:{
    color: theme.colors.accent
  }
}

export default WorkBench;
import React, { Component } from 'react';
import { Row, Col, Button} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert";
import TextCard from 'components/parts/TextCard';
import BoardForm from 'components/parts/BoardForm';
import API from 'utils/API';
import { standard, dark, colorBlind } from "utils/styles";

class UserHome extends Component {

    constructor(props){
        super(props);

        this.state={
            user: this.props.user,
            myBoards: [],
            // Modal attributes
            show: false,
            title: "Sweetie",
            text: null
        }
    }

    componentDidMount(){
      // console.log("UserHome mount state", this.state); // Comment back in for degugging
      // When component mounts get boards user is admin of
      this.getBoards();
    }

    componentDidUpdate(){
      // Anytime the state updates print to console
      // console.log("UserHome updated state", this.state); // Comment back in for degugging
    }

    // Call back end for board tied to the user by user._id wwhich getas boards with matiching _adminId
    getBoards = () => {
      API.getUserBoards(this.state.user._id).then(res=>{
        console.log("Get user boards res:", res.data);
        this.setState({ myBoards: res.data});
      }).catch(err=>console.error("Get boards hit an error", err));
    }

    // Pop up with form for user to create a new board
    createBoardModal = () => {
        this.setState({ 
          title:"Create a new board",
          text: <BoardForm adminId={this.state.user._id} refresh={this.getBoards()}  type="create" />,
          show: true
        });
    }

    // Format phone number into typical visual representaion
    formatNum = num => {
      num = `${num}`;
      return `${num.slice(0,3)}-${num.slice(3,6)}-${num.slice(6,10)}`;
    }

    // Take board id and put it in local storacge so when workbench loads it grabs board id from localstorage
    primeBoard = (id)=> {
      localStorage.setItem("board_id", id);
      this.setState({ show:false });
    }

    // Ask user to confirn that they want to work on that board in the workbench
    primeBoardModal = (id)=>{
      this.setState({ 
        show: true,
        title:"Load this board in workbench?",
        text: <div>
            <a href="/workbench"><Button style={styles.btn} className="m-1" onClick={()=>this.primeBoard(id)}>Y</Button></a>
            <Button style={styles.btn2} className="m-1" onClick={()=>this.setState({ show:false })}>N</Button>
          </div>
    })}

    // Allows a user to delete one of thier boards
    /**
     * This needs to go into collaborators and delete the colabBoard fro each user attached to board.
     * As it stands it just deletes a board. But if a colab has this info on thier colab boards it will remain.
     * And when they try to load it it will not work and when they quit it sent the admin a eamil about a user leaving a board
     * that doesn't exsist.
     */
    deleteBoard = id => {
      API.deleteBoard(id).then(res=>{
        console.log("Delete board response", res);
        this.getBoards();
      }).catch(err=>console.error("Delete board hit an error",err));
      this.setState({ show: false });
    }

    // Confirm that user wants to delete board
    deleteBoardModal = id => {
      this.setState({ 
        title: "Perminetly delete this board?",
        text: <Button className="p-3" onClick={() =>this.deleteBoard(id)} style={styles.btn}>Yes</Button>,
        show: true
       });
    }

    // If a user chooses to edit thier board title or description
    editBoardModal = board => {
      this.setState({ 
        title: "Edit board title and description",
        text: <BoardForm board={board} type="edit" refresh={()=>{this.setState({ show: false }); this.getBoards();}} />,
        show: true
       });
    }

    // Ask the user that they are sure they want to sign out.
    confirmSignOut = () => {
      this.setState({ 
        title: "Do you wish to sign out?",
        text: <Button className="p-3" onClick={() =>this.props.signOut()} style={styles.btn}>Yes</Button>,
        show: true
       });
    }

    // Confirm that the user is wanting to reove colab rights
    confirmColabRemoval = board => {
      console.log("Remove self colab status from board", board);
      this.setState({ 
        title: "Remove yourself as a collaborator from this board?",
        text: <Button className="p-3" onClick={()=>this.removeColabStatus(board.id)} style={styles.btn}>Yes</Button>,
        show: true
       });
    }

    // If a user chooses to remove thier right to collaborate on a board
    removeColabStatus = boardId =>{
      // Check that incoming data is correct
      console.log("remove colab status of", this.state.user._id, "on board", boardId);
      // Removes this board from this user's colabBoards
      API.removeColabRights(this.state.user._id,boardId).then(res=>{
        console.log("Remove yourself from board colabs response", res);
      }).catch(err=> console.error("Removing yourself from board colabs error", err));
      // Find board by id 
      API.getBoard(boardId).then(foundBoard=>{
        console.log("Found board:",foundBoard);
        let remIndex;
        // Search current colabs and find the user to be romoved. Once found use its index to spice it from the array
        foundBoard.data.collaborators.forEach((colab,i) => {
          if(colab.username === this.state.user.username){
            remIndex = i;
          }
        });
        // Remove user from colab list
        foundBoard.data.collaborators.splice(remIndex,1);
        console.log("Colab after change", foundBoard.data.collaborators);
        // Update board with new colab list
        API.updateBoard(boardId,{collaborators:foundBoard.data.collaborators}).then(updatedBoard => {
          console.log("Updated board response", updatedBoard);;
        }).catch(updateErr=>console.error("Update board error", updateErr));
      })
      window.location.reload(false); // Comment out for testing
    }

    render() {
      // Deconstruct state object
      const { myBoards, show, title, text, user } = this.state;
      return (
        <div>
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

          {/* Wrapper card that holds profile info */}
          <TextCard 
            title={`Name: ${user.name}`}
            subtitle={`Username: ${user.username}`}
            style={styles.userCard}
            headStyle={styles.header}
          >
            <Row>
              <Col className="mx-auto mb-5" sm="5">
                <ul>
                  <li>{this.formatNum(user.phone_num)}</li>
                  <li>{user.email}</li>
                  <li>{user.createdAt}</li>
                </ul>

                <Button 
                  style={styles.btn2}
                  className="m-1" 
                  onClick={()=> this.confirmSignOut()}>
                    Sign out
                </Button>
                
                <h3 className="ml-4 mt-3">Boards you are a collaborator on</h3>
                {user.colabBoards.length ? (
                    user.colabBoards.map((board,i) =>{
                      return(
                        <div key={i} className="border border-light rounded pb-2">
                          <h4 onClick={()=>this.primeBoardModal(board.id)} className="text-center rounded-top mb-2 pb-2 pt-2" 
                            style={styles.header}>
                            {board.title}
                          </h4>
                          <Button className="m-1 ml-5" style={styles.btn2} onClick={()=>this.confirmColabRemoval(board)}>X</Button>
                        </div>
                      )
                    })
                ) : null}
              </Col>

              <Col sm="6">
                <div>
                  <Button 
                    onClick={()=> this.createBoardModal()}
                    style={styles.btn}>
                    Make a new board
                  </Button>
                </div>

                <div>
                  <h3>Your Personal Boards</h3>
                  <div style={{overflow: "auto", maxHeight: "70vh"}}>
                    {/* If user boards have not loaded yet or none exsist show nothing */}
                    {myBoards.length ? (
                      myBoards.map((board,i)=>{
                        return(
                          <TextCard
                            key={i}
                            style={styles.card}
                            headStyle={styles.header}
                            title={board.title}
                            subtitle={board.description}
                            onClick={()=>{this.primeBoardModal(board._id)}}
                            
                          >
                            <Row style={{justifyContent:"space-around"}}>
                              <Col sm="6">
                                <Button style={styles.btn2} onClick={()=>this.deleteBoardModal(board._id)}>X</Button>
                              </Col>
                              <Col sm="6">
                                <Button style={styles.btn} onClick={()=>this.editBoardModal(board)}>Edit</Button>
                              </Col>
                            </Row>
                          </TextCard>
                        )
                      })
                    ): null}
                  </div>
                </div>
              </Col>
            </Row>
            
          </TextCard>
        </div>
      )
    }
}

// Theme switcher check for custom color styling
let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
  center: theme.classes.page,
  sweetBox:theme.classes.sweetBox,
  header: { 
    backgroundColor: theme.colors.background,
    color: theme.colors.secondary
  },
  userCard: {
    backgroundColor:  theme.colors.main,
    color:  theme.colors.accent,
    border: "none"
  },
  card:{
    backgroundColor:  theme.colors.accent,
    color:  theme.colors.main,
    margin: "10px",
    borderRadius: 10
  },
  btn: theme.classes.confirmBtn,
  btn2: theme.classes.closeBtn,
};

export default UserHome;
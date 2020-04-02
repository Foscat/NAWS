import React, { Component } from 'react';
import { Form, FormGroup, Input, Label, Button} from "reactstrap";
import { standard, dark, colorBlind } from "utils/styles";
import API from "utils/API";
const mailFormat = /^\w+([-]?\w+)*@\w+(\.-]?\w+)*(\.\w{2,3})+$/;


class ColabSearch extends Component{
	constructor(props) {
		super(props);
		this.state = {
			admin: this.props.admin,
			badEmail: false,
			noneThere: false,
			found: false,
			userFound: {},
			emailSearch: "",
			usernameSearch: ""
		};
	}
	
	componentDidMount(){
		// console.log("ColabSearch mount state", this.state);  // Comment in for degugging
	}

	componentDidUpdate(){
		// console.log("ColabSearch update state", this.state);  // Comment in for degugging
	}

	handleInputChange = event => {
		const { name, value } = event.target;
		this.setState({[name]: value});
	}

	// Search the database by email to find a user
	/**
	 * This should as user if they want to send this person a email asking the to join NAWS to colab on this board 
	 */
	searchByEmail =()=>{
		if(this.state.emailSearch.match(mailFormat)){
			API.findUserByEmail(this.state.emailSearch).then(res=>{
				console.log("Find user by email res", res);
				if(res.data){
					this.setState({ 
						userFound: res.data,
						found: true,
						emailSearch: "",
						usernameSearch: ""
					});
				}
				else this.setState({ noneThere: true });
			}).catch(err=>console.error("Find user by email error",err));
		}
		else{
			this.setState({ badEmail:true });
		}
	}

	// Search db for user by username
	searchByUsername =()=>{
		// console.log(this.state.usernameSearch);  // Comment in for degugging
		API.findUserByUsername(this.state.usernameSearch).then(res=>{
			// console.log("Find user by username res", res);  // Comment in for degugging
			if(res.data){
				this.setState({ 
					userFound: res.data,
					found: true,
					emailSearch: "",
					usernameSearch: ""
				});
			}
			else this.setState({ noneThere: true });
		}).catch(err=>console.error("Find user by email error",err));
	}

	// When a user chooses to add found user as a collaborator
	addCollaborator = ()=> {
		// Deconstruct userFound state
		let { userFound } = this.state;
		// Call function in utils to update board and who is allowed to collaborate on the board
		API.updateBoard(this.props.boardId, 
			{collaborators: [...this.props.currentColabs, {
				name: userFound.name,
				username: userFound.username,
				email: userFound.email,
				id: userFound._id
			}]
		})
		.then(res=> {
			// console.log("Add colab res", res);  // Comment in for degugging
			// Once user has been added to db send them a email notification informing them that they were added
			API.boardColabNotification({boardInfo:{
				admin: this.state.admin,
				colabName: userFound.name,
				colabEmail: userFound.email,
				title: res.data.title,
				description: res.data.description,
				password: res.data.password
			}}).then(bcNote=>{
				// console.log("Board colab email response", bcNote);  // Comment in for degugging
				console.log("Notification sent");
			})
			.catch(err=>console.error("Board colab email response", err));
		})
		.catch(err=>console.error("Add colab error",err));

		API.updateUser(userFound._id,{
		colabBoards: [...userFound.colabBoards,{
			id: this.props.boardId,
			title: this.props.boardTitle,
			admin: this.state.admin
		}]}).then(u_res=> {
			// console.log("Update user colab boards", u_res); // Comment in for degugging
			console.log("User updated");
		})
		.catch(err=>console.error("Update user colabs error", err));
	
		this.props.refresh();
	}

	render() {
		const {found, userFound, emailSearch, usernameSearch, noneThere,badEmail} = this.state;

		// If no user is found in search
		if(noneThere){
			return(
				<div>
					<h3>No user found by that {emailSearch.length ? "email" : "username"}.</h3>
					<Button 
						style={styles.btn} 
						onClick={()=>{
							this.setState({ 
								noneThere: false, 
								found:false, 
								emailSearch:"", 
								usernameSearch:"" 
							})}}
					>
						Try Another
					</Button>
				</div>
			)
		}
		// If email serch entry is not in correct email format
		else if(badEmail){
			return(
				<div>
					<h3>That email is not in correct format</h3>
					<Button style={styles.btn}  onClick={()=>this.setState({ badEmail:false })}>Try again</Button>
				</div>
			)
		}
		// If a user is not found
		else if(!found){
			return (
				<div>
					<Form>
						<FormGroup>
							<Label style={styles.label} className="ml-2" for="emailSearch">Search by email</Label>
							<Input type="email" name="emailSearch" id="emailSearch" value={emailSearch} onChange={this.handleInputChange}/>
							<Button style={styles.btn} onClick={()=>this.searchByEmail()}>Search</Button>
						</FormGroup>
					</Form>

					<Form>
						<FormGroup>
							<Label style={styles.label} className="ml-2" for="usernameSearch">Search by username</Label>
							<Input type="text" name="usernameSearch" id="usernameSearch" value={usernameSearch} onChange={this.handleInputChange}/>
							<Button style={styles.btn} onClick={()=>this.searchByUsername()}>Search</Button>
						</FormGroup>
					</Form>

				</div>
			);
		}
		// If a user has been found in search
		else{
			return(
				<div>
					<h3>Add {userFound.name} as a collaborator? </h3>
					<Button onClick={()=> this.addCollaborator()} className="m-1" style={styles.btn}>
						Yes
					</Button>
					<Button onClick={()=>this.props.refresh()} className="m-1" style={styles.btn2}>
						No
					</Button>
				</div>
			)
		}
	};

};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;
const styles = {
	btn: theme.classes.confirmBtn,
	btn2: theme.classes.closeBtn,
	label: {
		color: theme.colors.accent
	}
};

export default ColabSearch;
import React from 'react';
import { Row, Col } from "reactstrap";
import TextCard from "components/parts/TextCard";
import { standard, dark, colorBlind } from "utils/styles";
import API from 'utils/API';


const UsersList = ({ users }) => {
    return(
        <div>
            {users.length ? (
                users.map((user,i)=>{
                    return(
                        <TextCard
                            key={i}
                            className="mt-3"
                            style={styles.card}
                            headStyle={styles.head}
                            title={user.name}
                            subtitle={user.username}>
                            <Row>
                                <Col sm="11">
                                    <span>
                                        <h6 className="ml-3">Phone Number</h6> 
                                        <p style={styles.text}>
                                            {user.phone_num}
                                        </p>
                                    </span>
                                    <span>
                                        <h6 className="ml-3">Email</h6> 
                                        <p style={styles.text}>
                                            {user.email}
                                        </p>
                                    </span>
                                    <span>
                                        <h6 className="ml-3">Password</h6> 
                                        <p style={styles.text}>
                                            {user.password}
                                        </p>
                                    </span>
                                    <span>
                                        <h6 className="ml-3">User Since</h6> 
                                        <p style={styles.text}>
                                            {user.createdAt}
                                        </p>
                                        {/* Delete this feature before deployment */}
                                        <button onClick={()=>API.deleteUser(user._id).then(res=>console.log("delete user res",res)).catch(err=>console.error(err))}>X</button>
                                    </span>
                                </Col>
                            </Row>
                        </TextCard>
                    )
                })
                ): null
            }
        </div>
    )
};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;
const styles = {
    card: {
        backgroundColor: theme.colors.main,
        color: theme.colors.accent,
        border: `solid 2px ${theme.colors.accent}`
    },
    text: {
        color: theme.colors.secondary,
        backgroundColor: theme.colors.background,
        textAlign: "center",
        borderRadius: 10
    },
    head: {
        backgroundColor: theme.colors.background,
        color: theme.colors.secondary,
        borderRadius: 10,
        padding: 20
    }
}

export default UsersList;
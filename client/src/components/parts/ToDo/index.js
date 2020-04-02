import React from 'react';
import { Card, CardBody, CardText, CardHeader, Col, Row, Button } from "reactstrap"
import { standard, dark, colorBlind } from "utils/styles"; //, dark, colorBlind

const ToDo = ({ onClick, todo, progress,  hov, check, id, edit, deleteCard }) => {
    

    const handleDrag = (event,todo) => {
        event.preventDefault();
        onClick();
    }

    return(
        <Card 
         style={styles.card} 
         onDrag={event => handleDrag(event, todo)}
         draggable
         onMouseEnter={hov}
         onMouseOver={check}
         onMouseLeave={hov}
        >
            <CardHeader>
                <h3 style={styles.title}>{todo.title}</h3>
            </CardHeader>
            <CardBody style={styles.inner}>
                <CardText style={styles.text}>{todo.text}</CardText>
                <Row style={{justifyContent:"space-around"}}>
                    <Col sm="3">
                        <Button style={styles.btn2} onClick={()=>deleteCard(progress, id)}>X</Button>
                    </Col>
                    {todo.priority ? (
                        <Col sm="3">
                            <h6 className="text-center">Priority level {todo.priority}  </h6>
                        </Col>
                    ): null}
                    <Col sm="3">
                        <Button style={styles.btn} onClick={()=>edit(progress, id, {t:todo.title,d:todo.text,p:todo.priority})}>
                            Edit
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

let theme;
let themes = [standard, dark, colorBlind]
if(localStorage.getItem("colorTheme")) theme = themes[parseInt(localStorage.getItem("colorTheme"))];
else theme = standard;

const styles = {
    card: {
        backgroundColor: theme.colors.main,
        color: theme.colors.background,
        border: `solid 2px ${theme.colors.accent}`,
        margin: "8px auto"
    },
    inner: {
        margin: 5
    },
    title: {
        display: "inline-block",
        backgroundColor: theme.colors.background,
        color: theme.colors.secondary,
        borderRadius: "10px",
        width: "100%",
        padding: "5px 5px 5px 15px "
    },
    text: {
        textAlign: "center",
        color: theme.colors.accent
    },
    btn: theme.classes.confirmBtn,
    btn2: theme.classes.closeBtn
}

export default ToDo;
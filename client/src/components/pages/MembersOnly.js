import React, { Component } from 'react';
import TextCard from 'components/parts/TextCard';

class MembersOnly extends Component {
    
    componentDidMount(){
        if(localStorage.getItem("token")){
            this.props.authenticate();
        }
    }
    render(){
        return(
            <TextCard
                title="Members Only Feature"
                subtitle="Join today! We've got jackets!"/>
        )
    }
}

export default MembersOnly;
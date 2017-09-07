import React, { Component } from 'react';
import './Private.css';
import { connect } from 'react-redux';
import { getUserInfo } from '../../ducks/user.reducer';

class Private extends Component{
    componentDidMount(){
        this.props.getUserInfo()
    }
    
    render(){
        return(
            <div>
                <h1>Community Bank</h1>
                <div className='accountInfoContainer'>
                    <h4>Account Information: </h4>
                    {this.props.user ? <img className='avatar' src={this.props.user.img} alt=''/> : null}
                <div>
                    <p>Username: {this.props.user ? this.props.user.user_name : null}</p>
                    <p>Email: {this.props.user ? this.props.user.email : null}</p>
                    <p>ID: {this.props.user ? this.props.user.id : null}</p>

                    <h4>Available Balance: {this.props.user ? '$' + Math.floor((Math.random() + 1) * 100) + '.00' : null}</h4>
                </div>
                <a href={process.env.REACT_APP_LOGOUT}><button>Log Out</button></a>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

let outputActions = {
    getUserInfo: getUserInfo
}

export default connect(mapStateToProps, outputActions)(Private);
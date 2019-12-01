import React from 'react';
import axios from 'axios';
import {Container} from '@material-ui/core';
import MiniDrawer from './MiniDrawer.js';
import {setItem, getItem, clear} from '../LocalStorage'


export default class Lobby extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            roleURL : 'protected/ping/',
            leaveURL : "leaveRequest/employee/2/",
            role : 'staff',   //default role
            userInfo : {

            }
        }
        this.checkRole = this.checkRole.bind(this);
    }
    checkRole() {
        let _this = this;
        axios({
            url : _this.state.roleURL,
            baseURL : _this.props.baseURL,
            method : 'get',
            headers: {'Authorization': "Bearer " + _this.props.accessToken}
        })
        .then(function(){
          _this.setState((prevState) => ({
            ...prevState,
            role : 'hr',
            userInfo : _this.props.userInfo
          }));
        })
        .catch(function(){
          axios({
            url : _this.state.leaveURL,
            baseURL : _this.props.baseURL,
            method : 'get',
            headers : {
              'Authorization': 'Bearer '+ _this.props.accessToken
            }
          })
          .then(function(response){
            _this.setState((prevState) => ({
              ...prevState,
              userInfo : _this.props.userInfo,
              remainingPaidLeave : response.data.remainingPaidLeave,
              leaveRequests : response.data.leaveRequests
            }));
            setItem({"remainingPaidLeave" :  response.data.remainingPaidLeave, "leaveRequests" : response.data.leaveRequests});
          })
          .catch(function(){
            _this.setState((prevState) => ({
              ...prevState,
              userInfo : _this.props.userInfo
            }));
          })
        })
    }

    componentDidMount() {
      if (getItem("remainingPaidLeave"))
      {
        this.setState(() => ({
          userInfo : getItem("userInfo"),
          remainingPaidLeave : getItem("remainingPaidLeave"),
          leaveRequests : getItem("leaveRequests")
        }));
      }
      else
      {
        this.setState(() => ({
          userInfo : getItem("userInfo")
        }));
      }
      this.checkRole();
    }

    logOut() {
      clear();
      window.open('../','_self');
    }

    openDrawer() {
      this.setState(() => ({
        openDrawer : true
      }));
    }

    closeDrawer()
    {
      this.setState(() => ({
        openDrawer : false
      }));
    }

    render()
    {
        return(
            <Container>
                <MiniDrawer 
                  role = {this.state.role} 
                  userInfo = {this.state.userInfo} 
                  logOut = {() => this.logOut()}
                  baseURL = {this.props.baseURL}
                  accessToken = {this.props.accessToken}
                  leaveURL = {this.state.leaveURL}
                />
            </Container>
        )
    }
}
import React from 'react';
import axios from 'axios';
import {Container} from '@material-ui/core';
import MiniDrawer from './MiniDrawer.js';

import { getSelfId } from '../util/localStorage';
export default class Lobby extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            // hrURL : 'protected/ping/',    //this url used to check if current account's role is hr
            leaveURL : `leaveRequest/employee/${getSelfId()}/`,
            managerURL : `leaveRequest/manager/${getSelfId()}/`,
            userInfo : this.props.userInfo,
            totalAnnual : 15,
            leaveRequests : [],   //init purpose
            title : 'hr'
        }
        this.checkRole = this.checkRole.bind(this);
        this.updateLeaveBalance = this.updateLeaveBalance.bind(this);
        this.updateLeaveRequests = this.updateLeaveRequests.bind(this);
        this.counter = 0;
    }
    checkRole() //check every role the app support to decide what to render
    {
      if (this.state.userInfo.role === 'staff')
      {
        let _this = this;
        axios({         //check if current account is a dev
          url : _this.state.leaveURL,
          baseURL : _this.props.baseURL,
          method : 'get',
          headers : {
            'Authorization': 'Bearer '+ _this.props.accessToken
          }
        })
        .then(function(response){       //set this dev leave balance to localStorage
          _this.setState((prevState) => ({
            ...prevState,
            remainingPaidLeave : response.data.remainingPaidLeave,
            leaveRequests : response.data.leaveRequests,
            title : 'dev'
          }));
        })
        .catch(function(){        //otherwise get this manager leave requests that need his attention
          axios({
            url : _this.state.managerURL,
            baseURL : _this.props.baseURL,
            method : 'get',
            headers : {
              'Authorization': 'Bearer '+ _this.props.accessToken
            }
          })
          .then(function(response){
            _this.setState((prevState) => ({
              ...prevState,
              leaveRequests : response.data.leaveRequests,
              title : 'manager'
            }));
          })
          .catch(function(error){
            console.log(error);
            console.log(_this.props.accessToken);
          })
        })
      }
    }

    updateLeaveRequests()
    {
      let _this = this;
      axios({
        url : _this.state.managerURL,
        baseURL : _this.props.baseURL,
        method : 'get',
        headers : {
          'Authorization': 'Bearer '+ _this.props.accessToken
        }
      })
      .then(function(response){
        _this.setState((prevState) => ({
          ...prevState,
          leaveRequests : response.data.leaveRequests
        }));
      })
      .catch(function(error){
        console.log(error);
      })
    }

    updateLeaveBalance()
    {
      let _this = this;
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
          remainingPaidLeave : response.data.remainingPaidLeave,
          leaveRequests : response.data.leaveRequests
        }));
      })
      .catch(function(error){   
        console.log(error);
      })
    }

    componentDidMount()
    {
      this.checkRole();
      // this.setState(() => ({
      //   userInfo : this.props.userInfo
      // }))
    }
    componentDidUpdate(prevProp)
    {
        if (prevProp.accessToken !== this.props.accessToken)
        {
            this.checkRole();
        }
    }
    logOut()
    {
      window.open('http://localhost:3000/','_self');
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
            <Container maxWidth = '1'>
                <MiniDrawer 
                  userInfo = {this.props.userInfo} 
                  logOut = {() => this.logOut()}
                  baseURL = {this.props.baseURL}
                  accessToken = {this.props.accessToken}
                  leaveURL = {this.state.leaveURL}
                  remainingPaidLeave = {this.state.remainingPaidLeave}
                  totalAnnual = {this.state.totalAnnual}
                  leaveRequests = {this.state.leaveRequests}
                  managerURL = {this.state.managerURL}
                  updateLeaveBalance = {() => this.updateLeaveBalance()}
                  updateLeaveRequests = {() => this.updateLeaveRequests()}
                  title = {this.state.title}
                />
            </Container>
        )
    }
}
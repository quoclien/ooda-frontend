import React from 'react';
import axios from 'axios';
import { CssBaseline, Grid, Paper, Container} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LeaveDetail from './LeaveDetail.js';
import LeaveRequestTable from './LeaveRequestTable'
import {getItem, setItem} from '../LocalStorage'
export default class LeaveBalance extends React.Component{
    constructor(props)
    {
        super(props);
        this.theme = createMuiTheme();
        this.makeThemeH1 = this.makeThemeH1.bind(this);
        this.cellNames = ['Lý do', 'Từ ngày', 'Đến ngày', 'Số ngày nghỉ', 'Trạng thái'];
        this.state = {
            totalRequest : 0,
            remainRequest : 0,
            decidedRequests : {} 
        }
        this.leaveDecide = this.leaveDecide.bind(this);
    }


    componentDidUpdate(prevProp)
    {
        if (prevProp.leaveRequests !== this.props.leaveRequests)
        {
            if (getItem('decidedRequests'))
            {
                this.setState(() => ({
                    totalRequest : getItem("totalRequest"),
                    remainRequest : getItem("remainRequest"),
                    decidedRequests : getItem("decidedRequests")
                }))
            }
            else
            {
                this.setState(() => ({
                    totalRequest : this.props.leaveRequests.length,
                    remainRequest : this.props.leaveRequests.length
                }));
            }
        }
    }

    makeThemeH1()
    {
        this.theme.typography.h2 = {
            fontSize: '8rem',
            '@media (min-width:600px)': {
              fontSize: '4.5rem',
            },
            [this.theme.breakpoints.up('md')]: {
              fontSize: '6rem',
            },
          };
    }

    leaveDecide(decision, id)
    {
        let _this = this;
        axios({
            url : _this.props.managerURL,
            baseURL : _this.props.baseURL,
            method : "patch",
            headers : {
                'Authorization': 'Bearer '+ _this.props.accessToken
            },
            data : {
                'leaveRequestId' : '' + id,
                'decision' : decision
            }
        })
        .then(function(){
            let newDecidedRequests = _this.state.decidedRequests;
            decision == 'rejected' ? newDecidedRequests[id] = 'Đã bỏ qua' : newDecidedRequests[id] = 'Đã chấp thuận';
            _this.setState((prevState) => ({
                ...prevState,
                remainRequest : prevState.remainRequest - 1,
                decidedRequests : newDecidedRequests
            }));
            setItem(_this.state);
        })
        .catch(function(error){
            console.log(error);
            console.log(_this.props.leaveRequests);
            console.log(_this.state.totalRequest);
        })
    }

    componentDidMount()
    {
        // this.props.updateLeaveRequests();
        if (getItem("decidedRequests"))
        {
        this.setState(() => ({
            totalRequest : getItem("totalRequest"),
            remainRequest : getItem("remainRequest"),
            decidedRequests : getItem("decidedRequests")
        }))
        }
    }

    render()
    {
        console.log(getItem("remainRequest"));
        console.log(getItem('decidedRequests'));
        if (this.props.title == 'manager')     //check if there is a title from manager's leaveRequests
        {
            this.cellNames = ['Họ tên', 'Vị trí', 'Lý do', 'Từ ngày', 'Đến ngày', 'Số ngày nghỉ', 'Quyết định'];
        }
        return(
            <div>
                <CssBaseline />
                <div >
                    <ThemeProvider theme = {this.theme}>
                        <Grid container spacing = {1} direction="row">
                            <Grid item lg = {12}>
                                <Paper
                                square = 'true'
                                elevation = {3}
                                component = 'div'
                                >
                                    <LeaveDetail 
                                        remainingPaidLeave = {this.props.remainingPaidLeave}
                                        totalAnnual = {this.props.totalAnnual}
                                        totalRequest = {this.state.totalRequest}
                                        remainRequest = {this.state.remainRequest}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item lg = {12}>
                                <Container>
                                    <LeaveRequestTable 
                                    leaveRequests = {this.props.leaveRequests}
                                    cellNames = {this.cellNames}
                                    leaveDecide = {this.leaveDecide}
                                    decidedRequests = {this.state.decidedRequests}
                                    totalRequest = {this.state.totalRequest}
                                    />
                                </Container>
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </div>
            </div>
        )
    }
}
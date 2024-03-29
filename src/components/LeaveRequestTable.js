import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  button: {
    margin: 5,
  },
  table: {
    minWidth: 650
  },
});

const rowColor = {
  approved : '#2196f3',
  rejected : '#f50057',
  pending : '#FFC75F',
  header : '#eceff1'
};





export default function SimpleTable(props) {
  const classes = useStyles();

    let rows = props.leaveRequests;

    const cellNames = props.cellNames;

    function handleClick(e, decision, id)
    {
      props.leaveDecide(decision, id);
    }

    function getLeaveDayUsed()
    {
      let num = 0;
      if (!rows.forEach) {
        rows = JSON.parse(rows);
      }
      rows.forEach(element => {
        if (element.status === 'APPROVED' || element.status === 'PENDING')
        {
          num+= element.numberOfDays;
        }
      })
      return num;
    }

    function getTableRowColor(id, status, decidedLeaves)
    {
      if (Object.keys(decidedLeaves).length > 0 && Object.keys(decidedLeaves).includes(""+id))
      {
        if (decidedLeaves[id] === 'Đã chấp thuận')
        {
          return rowColor.approved;
        }
        else
        {
          return rowColor.rejected;
        }
      }
      if (status === 'APPROVED')
      {
        return rowColor.approved;
      }
      else if (status === 'REJECTED')
      {
        return rowColor.rejected;
      }
      return rowColor.pending;

    }

    let total = props.totalAnnual;
    let leaveUsed = getLeaveDayUsed();
    let remain = (total - leaveUsed >= 0 ? (total - leaveUsed) : props.remainingPaidLeave);



  return (
    rows.length > 0 ?
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow style = {{backgroundColor: rowColor.header}}>
            {
              cellNames.map((name, index) => (
                index === 0 ?
                <TableCell>
                  <Typography variant ='h6'>{name}</Typography>
                </TableCell>
                :
                name === 'Quyết định' ?
                <TableCell align="center">
                  <Typography variant ='h6'>{name}</Typography>
                </TableCell>
                :<TableCell align="right">
                  <Typography variant ='h6'>{name}</Typography>
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
            key={row.id} 
            style = {
                {
                backgroundColor: getTableRowColor(row.id,row.status, props.decidedRequests)
                }
                }>
              {
                props.title !== 'manager' ?
                <TableCell component="th" scope="row">
                {row.reason}
                </TableCell>
                :
                <>
                <TableCell component="th" scope="row">
                {/* {row.name} */} Pham Huy Phat
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.reason}</TableCell>
                </>
              }
              <TableCell align="right">{row.fromDate}</TableCell>
              <TableCell align="right">{row.toDate}</TableCell>
              <TableCell align="right">{row.numberOfDays}</TableCell>
              {props.title !== 'manager' ?    //check if there is a title key in leaveRequests -> tell if current account is a manager or not
              <TableCell align="right">{row.status == 'APPROVED' ? 'Đã chấp thuận' : row.status == 'REJECTED' ? 'Đã từ chối' : 'Đang đợi duyệt'}</TableCell>
              :Object.keys(props.decidedRequests).includes(''+row.id) ?
              <TableCell align="center">
                {props.decidedRequests[''+row.id]}
              </TableCell>
              :<TableCell align="center">
                <Button
                className={classes.button}
                type="button"
                variant='contained'
                color="primary"
                onClick = { e => handleClick(e, 'approved', row.id)}
                >
                  Chấp thuận
                </Button>
                <Button
                className={classes.button}
                type = 'button'
                variant='contained'
                color = 'secondary'
                onClick = { e => handleClick(e, 'rejected', row.id)}
                >
                  Bỏ qua
                </Button>
              </TableCell>
              }
            </TableRow>
          ))}
          {
            props.title == 'dev' ? 
            <>
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Số ngày phép đã sử dụng</TableCell>
                <TableCell align="right">{leaveUsed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tổng số ngày phép trong năm</TableCell>
                <TableCell align="right">{total}</TableCell>
              </TableRow>
              <TableRow style = {{borderTop: 'double', borderTopWidth: 'thick'}}>
                <TableCell colSpan={2}>Số ngày phép còn lại</TableCell>
                <TableCell align="right">{remain}</TableCell>
              </TableRow>
            </>
            :''
          }
        </TableBody>
      </Table>
    </Paper>
    :
    'Không có gì để xử lý ở đây'
  );
}
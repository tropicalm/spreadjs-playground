import React from 'react';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


export default function Form({ dataBindings, dataRefs, onChange }) {
  const classes = useStyles();

  const handleInputChange = (event) => {
    event.persist();
    onChange(inputs => ({...inputs, [event.target.name]: parseInt(event.target.value)}));
  }

  return (
    <div>
    <form className={classes.container} noValidate autoComplete="off">
      <div>
        {Object.keys(dataBindings).map(key => (
          <TextField
            key={key}
            name={key}
            label={key}
            type="number"
            size="small"
            value={dataBindings[key]}
            className={classes.textField}
            onChange={handleInputChange}
            margin="dense"
          />
        ))}
      </div>
    </form>
    
    <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Formula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRefs.map(ref => (
              <TableRow key={ref.name}>
                <TableCell component="th" scope="row">
                  {ref.name}
                </TableCell>
                <TableCell align="right">{ref.value}</TableCell>
                <TableCell align="right">{ref.formula}</TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
    </div>
  );
}

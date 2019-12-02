import React, {useCallback, useEffect, useState} from 'react';
import * as APIService from '../../services/APIService';
import {Button, Container, makeStyles, TextField, Typography,} from '@material-ui/core';
import {Link, Redirect} from 'react-router-dom';
import {Field, Form} from 'react-final-form';
import {checkStudentId} from "../../services/APIService";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(4),
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginBottom: theme.spacing(2),
  },
}));

const StudentScreen = ({match, history}) => {
  const studentId = match.params.studentId;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (studentId) {
      const currentStudent = APIService.getStudent(studentId);

      setStudent(currentStudent);
    }
  }, [studentId]);

  const handleFormSubmit = useCallback(
    values => {
      if (studentId) {
        APIService.updateStudent(studentId, values);
      } else {``
        APIService.addStudent(values);
      }

      history.push('/students');
    },
    [studentId, history]
  );

  const validate = async values => {
    
    const errors = {};
    const checkImage = new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(true);
        };
        img.onerror = function () {
            reject(false);
        };
        img.src = values.avatar;
    });
    await checkImage.then(
        () => {
            console.log("Not found")
        }
    ).catch(
        () => {
            errors.avatar = true
        }
    );
    if (!values.avatar) {
      errors.avatar = 'Please fill out the avatar';
    }

    if (!values.name) {
      errors.name = 'Please fill out the name';
    }

    if (!values.address) {
      errors.address = 'Please fill out the address';
    }

  
    return errors;
};

const classes = useStyles();

if (studentId) {
    if(!checkStudentId(studentId))
    return (
        <Redirect to="/404-not-found"/>
    );
}


  return (
    <Container maxWidth="sm">
      <Typography variant="h6" className={classes.title}>
        {studentId ? 'Update Student' : 'Create Student'}
      </Typography>
      <Form onSubmit={handleFormSubmit} validate={validate} initialValues={student}>
        {({handleSubmit}) => (
          <>
            <Field name="avatar">
            {({input, meta}) => (
                <TextField
                error={meta.error && meta.touched}
                className={classes.field}
                label="Avatar URL"
                variant="outlined"
                fullWidth
                helperText={meta.touched ? meta.error : ''}
                {...input}
                />
              )}
            </Field>
            <Field name="name">
              {({input, meta}) => (
                <TextField
                  error={meta.error && meta.touched}
                  className={classes.field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  helperText={meta.touched ? meta.error : ''}
                  {...input}
                />
              )}
            </Field>
            <Field name="address">
              {({input, meta}) => (
                <TextField
                  error={meta.error && meta.touched}
                  className={classes.field}
                  label="Address"
                  variant="outlined"
                  fullWidth
                  helperText={meta.touched ? meta.error : ''}
                  {...input}
                />
              )}
            </Field>
            <Button
              onClick={handleSubmit}
              fullWidth
              color="primary"
              variant="contained"
              size="large"
              className={classes.submitButton}
            >
              Submit
            </Button>
            {studentId && (
              <Button
                component={Link}
                to={`/students/delete/${studentId}`}
                fullWidth
                color="secondary"
                variant="outlined"
                size="large"
              >
                Delete student
              </Button>
            )}
          </>
        )}
      </Form>
    </Container>
  );
};

export default StudentScreen;

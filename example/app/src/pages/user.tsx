
import React from 'react';
import {Link} from 'react-router-dom';

const Users = () => {
  return (
      <>
          <p> Users </p>
          <Link to='/me'>Me</Link>
      </>);
};

const Me = () => {
  return (<><p> Me </p> <Link to='/'>go Home</Link></>);
};

export default Users;
export {
  Me
};
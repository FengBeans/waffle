import React from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
  const [text, setText] = React.useState('Hello waffle!');
  return (
      <>
          <p
              onClick={() => {
                  setText('Hi!')
              }}> {text} </p>
          <Link to='/user'>跳转到user</Link>
      </>);
};


export default Home;
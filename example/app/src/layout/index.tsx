import React from 'react';
import { useLocation } from 'react-router-dom';
import { useKeepOutlets } from '@waffle/keepalive';
import './index.css';

const Layout = () => {
    const { pathname } = useLocation();
    const element = useKeepOutlets();
    return (
      <>
      <div className='waffle-content'>
      当前路由: {pathname}
        {element}
      </div>
 
      </>
    )
}

export default Layout;
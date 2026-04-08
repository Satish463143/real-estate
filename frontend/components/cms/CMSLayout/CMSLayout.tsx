"use client"
import React,{useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../Navbar/Navbar'
import './CMSLayout.css'
import TopNav from '../TopNav/TopNav'
import MobileNav from '../MobileNav/MobileNav'
import CheckPermission from '../../../src/config/rbac.config'
import { getLoggedInUser } from '../../../src/reducer/user.reducer'

const CMSLayout = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const loggedInUser = useSelector((root: any) => root.user.loggedInUser);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  // Restore user session on mount if token exists
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('_at');
      
      // If token exists but user is not in Redux store, fetch user data
      if (token && !loggedInUser) {
        try {
          await dispatch(getLoggedInUser() as any);
        } catch (error) {
          console.error('Failed to restore session:', error);
          // If token is invalid, clear it
          localStorage.removeItem('_at');
          localStorage.removeItem('_rt');
        }
      }
      
      setIsInitializing(false);
    };

    restoreSession();
  }, [dispatch, loggedInUser]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className='body_grid'>
        <CheckPermission allowedBy="admin">
          <div><Navbar/></div>         
          <div className='body_box'> 
            <TopNav isMenuActive={isMenuActive} toggleMenu={toggleMenu}/>
            <MobileNav isMenuActive={isMenuActive} toggleMenu={toggleMenu}/>              
            {children}
          </div> 
        </CheckPermission>
      </div>
    </>
  )
}
export default CMSLayout

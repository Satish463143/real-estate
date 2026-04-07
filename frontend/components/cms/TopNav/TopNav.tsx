'use client'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { logoutUser } from '../../../src/reducer/user.reducer'

const TopNav = ({ isMenuActive, toggleMenu }: { isMenuActive: boolean, toggleMenu: () => void }) => {
    const dispatch: any = useDispatch()
    const loggedInUser: any = useSelector((root: any)=>{
        return root.user.loggedInUser
    })
    const logout = async () => {
        try {
            toast.loading("Logging out...");
           
            // Call the logout endpoint to clear tokens in the database
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('_at')}`,
                },
            })
        } catch (error) {
            console.error("Logout API call failed:", error);
            // Continue with logout even if API call fails
        } finally {
            // Always clear local data regardless of API call success
            // Remove tokens from localStorage
            localStorage.removeItem('_at');
            localStorage.removeItem('_rt');
            dispatch(logoutUser())
    
            toast.dismiss(); // Remove the loading toast
            toast.success("You have been logged out successfully")
            
            // Reload the page to clear all cached data and reset the app state
            setTimeout(() => {
                window.location.href = '/admin';
            }, 1000);
        }
    };

  return (
    
    <div className='top_nav' style={{background:'#fff'}}>
        <ToastContainer/>
        <div className='welcome_message'>
            <div className={`hamburg_menu ${isMenuActive ? 'menuActive' : ''}`} onClick={toggleMenu}>
                <div className='menu_1'></div>
                <div className='menu_2'></div>
                <div className='menu_3'></div>
            </div>
            <p>Hi, Welcome Back {loggedInUser?.name}</p>
        </div>
          
          
        <div className="top_nav_end">
            <ul>
                <div className='admin_box ' style={{margin:'0', cursor:'pointer'}} onClick={logout}>
                    <div>
                    <span>
                        <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(0 -1028.4)"><path d="m12 1039.4c-1.277 0-2.4943 0.2-3.5938 0.7 0.6485 1.3 2.0108 2.3 3.5938 2.3s2.945-1 3.594-2.3c-1.1-0.5-2.317-0.7-3.594-0.7z" fill="#95a5a6"/>
                            <path d="m8.4062 1041.1c-2.8856 1.3-4.9781 4-5.3437 7.3 0 1.1 0.8329 2 1.9375 2h14c1.105 0 1.938-0.9 1.938-2-0.366-3.3-2.459-6-5.344-7.3-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#d35400"/>
                            <path d="m8.4062 1040.1c-2.8856 1.3-4.9781 4-5.3437 7.3 0 1.1 0.8329 2 1.9375 2h14c1.105 0 1.938-0.9 1.938-2-0.366-3.3-2.459-6-5.344-7.3-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#e67e22"/>
                            <path d="m12 11c-1.147 0-2.2412 0.232-3.25 0.625 0.9405 0.616 2.047 1 3.25 1 1.206 0 2.308-0.381 3.25-1-1.009-0.393-2.103-0.625-3.25-0.625z" fill="#7f8c8d" transform="translate(0 1028.4)"/>
                            <path d="m17 4a5 5 0 1 1 -10 0 5 5 0 1 1 10 0z" fill="#060060" transform="translate(0 1031.4)"/>
                            <path d="m8.4062 1040.1c-0.3172 0.2-0.6094 0.3-0.9062 0.5 0.8153 1.6 2.541 2.8 4.5 2.8s3.685-1.2 4.5-2.8c-0.297-0.2-0.589-0.3-0.906-0.5-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#d35400" />
                        </g>
                        </svg>
                    </span>
                    </div>
                    <div >
                        <p style={{color:'white'}}>Log Out</p>
                    </div>
                </div>                
            </ul>
        </div>
    </div>
  )
}

export default TopNav
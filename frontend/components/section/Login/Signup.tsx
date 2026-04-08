"use client"
import * as Yup from 'yup';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './Login.css'
import { TextInputComponent } from '@/components/common/InputBox/InputBox';
import { useLoginMutation } from '../../api/login.api';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';


const Signup = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [loginUser] = useLoginMutation()  
    // Check if user is already logged in from Redux store, not from API call
    const loggedInUser = useSelector((root:any) => root.user.loggedInUser);
  
    useEffect(() => {
      // Only redirect if user is in Redux store AND there's a valid token
      const token = localStorage.getItem('_at');
      if(loggedInUser && token){
        
      }
    },[])
  
    const loginDTO = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginDTO),
    });

    const login = async(data: any) => {
        setLoading(true);
        try {
            const response = await loginUser(data).unwrap();
            localStorage.setItem("_at", response.result.token.token);
            localStorage.setItem("_rt", response.result.token.refreshToken);
            setTimeout(() => {
                if(response.result.userDetails.role === 'admin'){
                    router.push('/admin/dashboard');
                }else{
                    router.push('/my-account');
                }
            }, 500); 

        }catch(error:any){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.data?.message || "Login failed",
            })
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className='login_container'>
            <div className="login_box">
                <div className="login_header">
                    <h1>Login</h1>
                    <p>Enter your credentials to access the dashboard</p>
                </div>
                
                <form onSubmit={handleSubmit(login)} className="login_form">
                    <div className="form_group">
                        <label htmlFor="email">Email Address</label>
                        <TextInputComponent
                            type="email"
                            placeholder="Enter your password"
                            className=""
                            style={{ }}
                            control={control}
                            name="email"
                            defaultValue=""
                            required={true}
                            errMsg={errors.email?.message as string | null}
                        />
                    </div>

                    <div className="form_group">
                        <label htmlFor="password">Password</label>
                        <TextInputComponent
                            placeholder="Enter your password"
                            className=""
                            style={{ }}
                            type="password"
                            control={control}
                            name="password"
                            defaultValue=""
                            required={true}
                            errMsg={errors.password?.message as string | null}
                        />
                    </div>
                    <button type='button' disabled={loading} className="login_button">
                        Sign Up
                    </button>
                    <button type='submit' disabled={loading} className="login_button">
                        Sign In
                        {loading && <span className="loading_spinner">Signing in...</span>}
                    </button>
                    
                </form>
            </div>        
        </div>
    )
}

export default Signup
"use client"
import * as Yup from 'yup';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './Login.css'
import { TextInputComponent } from '@/components/common/InputBox/InputBox';
import { useCreateUserMutation } from '../../api/user.api';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';


const Signup = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [createUser] = useCreateUserMutation()  
    // Check if user is already logged in from Redux store
    const loggedInUser = useSelector((root:any) => root.user.loggedInUser);
  
    useEffect(() => {
      // Only redirect if user is in Redux store AND there's a valid token
      const token = localStorage.getItem('_at');
      if(loggedInUser && token){
          router.push('/my-account');
      }
    },[loggedInUser, router])
  
    const signupDTO = Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().nullable(),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signupDTO),
    });

    const signup = async(data: any) => {
        setLoading(true);
        try {
            await createUser(data).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Account created successfully. Please login.",
            })
            setTimeout(() => {
                router.push('/login');
            }, 500); 
        }catch(error:any){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.data?.message || "Signup failed",
            })
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className='login_container'>
            <div className="login_box" style={{ maxWidth: '500px' }}>
                <div className="login_header">
                    <h1>Sign Up</h1>
                    <p>Create a new account</p>
                </div>
                
                <form onSubmit={handleSubmit(signup)} className="login_form">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form_group" style={{ flex: 1 }}>
                            <label htmlFor="firstName">First Name</label>
                            <TextInputComponent
                                type="text"
                                placeholder="Enter first name"
                                className=""
                                style={{ }}
                                control={control}
                                name="firstName"
                                defaultValue=""
                                required={true}
                                errMsg={errors.firstName?.message as string | null}
                            />
                        </div>
                        <div className="form_group" style={{ flex: 1 }}>
                            <label htmlFor="lastName">Last Name</label>
                            <TextInputComponent
                                type="text"
                                placeholder="Enter last name"
                                className=""
                                style={{ }}
                                control={control}
                                name="lastName"
                                defaultValue=""
                                required={true}
                                errMsg={errors.lastName?.message as string | null}
                            />
                        </div>
                    </div>

                    <div className="form_group">
                        <label htmlFor="email">Email Address</label>
                        <TextInputComponent
                            type="email"
                            placeholder="Enter your email"
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
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <TextInputComponent
                            type="text"
                            placeholder="Enter your phone number"
                            className=""
                            style={{ }}
                            control={control}
                            name="phone"
                            defaultValue=""
                            required={false}
                            errMsg={errors.phone?.message as string | null}
                        />
                    </div>

                    <div className="form_group">
                        <label htmlFor="password">Password</label>
                        <TextInputComponent
                            placeholder="Create a password"
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

                    <button type='submit' disabled={loading} className="login_button" style={{ marginTop: '10px' }}>
                        Sign Up
                        {loading && <span className="loading_spinner">Signing up...</span>}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                            Already have an account?{' '}
                            <a 
                                href="/login" 
                                style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}
                                onClick={(e) => { e.preventDefault(); router.push('/login'); }}
                            >
                                Sign In
                            </a>
                        </span>
                    </div>
                    
                </form>
            </div>        
        </div>
    )
}

export default Signup
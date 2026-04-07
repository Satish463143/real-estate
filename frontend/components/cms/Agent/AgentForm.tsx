'use client'
import { useEffect } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {TextInputComponent} from '../../common/InputBox/InputBox'


const TeamForm = ({submitEvent,loading,value,detail}:{submitEvent: (data: any) => void,loading: boolean,value: any,detail: any}) => {

    const teamDTO = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        phone: Yup.string().required('Phone is required'),
        email: Yup.string().required('Email is required'),
        avatarUrl: Yup.mixed().required('Image is required'),
    })
    const { control, handleSubmit, setValue,  formState: { errors } } = useForm({
        resolver: yupResolver(teamDTO),  
    })
    useEffect(() => {
        if (detail) {
            setValue('firstName', detail.firstName )
            setValue('lastName', detail.lastName )
            setValue('phone', detail.phone )
            setValue('email', detail.email )
            setValue('avatarUrl', detail.avatarUrl )
        }
    }, [detail,setValue])

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
        <div className="from_grid">
            <div>
                <label htmlFor="firstName">First Name</label><br />
                <TextInputComponent
                    name="firstName"
                    placeholder='Enter First Name'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.firstName?.message as string}
                    required={true}
                />
            </div> 
            <div>
                <label htmlFor="lastName">Last Name</label><br />
                <TextInputComponent
                    name="lastName"
                    placeholder='Enter Last Name'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.lastName?.message as string}
                    required={true}
                />
            </div> 
            <div>
                <label htmlFor="phone">Phone</label><br />
                <TextInputComponent
                    name="phone"
                    placeholder='Enter Phone Number'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.phone?.message as string}
                    required={true}
                />
            </div>
                     
            <div>
                <label htmlFor="email">Email</label><br />
                <TextInputComponent
                    name="email"
                    placeholder='Enter Email'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.email?.message as string}
                    required={true}
                />
            </div>                 
            <div>                
                <label htmlFor="avatarUrl">Image</label><br />
                <input
                    type='file'
                    onChange={(e) => {
                        const image = (e.target as HTMLInputElement).files?.[0] as File
                        setValue('avatarUrl' as any, image)
                    }}
                /><br />
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center',  }}>            
            <input className='submit_btn' type="submit" value={value} disabled={loading} style={{cursor:'pointer'}}/>
        </div>
    </form>
  )
}

export default TeamForm
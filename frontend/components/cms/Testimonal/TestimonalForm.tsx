'use client'
import { useEffect } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {TextInputComponent} from '../../common/InputBox/InputBox'


const TestimonalForm = ({submitEvent,loading,value,detail}:{submitEvent: (data: any) => void,loading: boolean,value: any,detail: any}) => {

    const testimonalDTO = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        rating: Yup.number().required('Rating is required'),
        review: Yup.string().required('Review is required'),
        image: Yup.mixed().required('Image is required'),
    })
    const { control, handleSubmit, setValue,  formState: { errors } } = useForm({
        resolver: yupResolver(testimonalDTO),  
    })
    useEffect(() => {
        if (detail) {
            setValue('name', detail.name )
            setValue('rating', detail.rating )
            setValue('review', detail.review )
            setValue('image', detail.image )
        }
    }, [detail,setValue])

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
        <div className="from_grid">
            <div>
                <label htmlFor="name">Name</label><br />
                <TextInputComponent
                    name="name"
                    placeholder='Enter Name'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.name?.message as string}
                    required={true}
                />
            </div> 
            <div>
                <label htmlFor="rating">Rating</label><br />
                <TextInputComponent
                    name="rating"
                    placeholder='Enter Rating'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.rating?.message as string}
                    required={true}
                />
            </div> 
            <div>
                <label htmlFor="review">Review</label><br />
                <TextInputComponent
                    name="review"
                    placeholder='Enter Review'
                    className=''
                    style={{}}
                    control={control}
                    type='text'
                    defaultValue=''
                    errMsg={errors?.review?.message as string}
                    required={true}
                />
            </div>              
            <div>                
                <label htmlFor="image">Image</label><br />
                <input
                    type='file'
                    onChange={(e) => {
                        const image = (e.target as HTMLInputElement).files?.[0] as File
                        setValue('image' as any, image)
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

export default TestimonalForm
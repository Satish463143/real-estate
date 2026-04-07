"use client"
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import Link from 'next/link'

const DeleteButton = ({deleteAction,rowId}) => {
    const handleDelete = async(e)=>{
        e.preventDefault()
        try{
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              })
              if(result.isConfirmed){
                deleteAction(rowId)
              }

        }catch(exception){
            console.log(exception)
            toast.error("Error deleting data")
        }
    }
  return (
    <Link href="#" onClick={handleDelete}>
      <button className="edit_btn" style={{ background: '#d13232' }}>Delete</button>
    </Link>
  )
}

export default DeleteButton
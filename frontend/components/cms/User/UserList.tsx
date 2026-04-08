'use client'
import { useState } from 'react';
import { useListAllQuery, useDeleteUserMutation } from '../../api/user.api';
import AdminTitle from '../AdminTitle/AdminTitle';
import LoadingComponent from '../../common/Loading/Loading.component';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import { Pagination } from 'flowbite-react';
import Swal from 'sweetalert2';

const UserList = () => {
    const [search, setSearch] = useState(''); // Ensure default value is a string
    const [page, setPage] = useState(1);
    const [limit] = useState(10); 

    const {data, error, isLoading} = useListAllQuery({ page, limit, search })
    const [deleteUser] = useDeleteUserMutation()
    const user = data?.details || []

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value); // Update the search state
        setPage(1); // Reset to the first page
      };
    
      const handlePageChange = (newPage: number) => {
        setPage(newPage);
      };    
    
      const deleteData=async(id:string)=>{
        try{
          await deleteUser(id).unwrap()
          Swal.fire({
            title:"Deleted!",
            text:"User deleted successfully",
            icon:"success"
          })
        }catch(exception){
          Swal.fire({
            title:"Error!",
            text:"Cannot delete user at this moment",
            icon:"error"
          })
        }    
      }
  return (
    <div className='admin_margin_box'>
      <div className='admin_titles'>
        <AdminTitle url='/admin/user' label1=' User List' label2='' />
        <div className='Dashboard_title'>
          <h1>User List</h1>
          <div>
          <input
              type="search"
              className="search_btn"
              placeholder="Filter by name..."
              value={search}
              onChange={handleSearchChange}
          />         
          </div>
        </div>
      </div>
      <div className='blog_table'>        
        <table border={2}>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>  
                <td colSpan={6}><LoadingComponent/></td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="error-message">{(error as any)?.data?.message}</td>
              </tr>
            ) : user && user.length > 0 ? (
              user.map((row: any, index: number) => (
                <tr key={index}>
                  <td className="table_sn">{index + 1}</td>
                  <td>{row.email}</td>
                  <td>{row.firstName} {row.lastName}</td>
                  <td>{row.phone}</td>
                  <td style={{ textAlign: 'center', width: '150px' }}>
                    <EditButton editUrl={`/admin/edit_user?id=${row.id}`}/>
                    <DeleteButton deleteAction={deleteData} rowId={row.id}/>                  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>User List is Empty</td>
              </tr>
            )}
          </tbody>
        </table>       
        <div className='flex overflow-x-auto sm:justify-center'>
            {data?.meta && data.meta.total > 0 && (
            <div className='flex overflow-x-auto sm:justify-center'>
                <Pagination                
                currentPage={data.meta.currentPage || 1}
                totalPages={Math.ceil(data.meta.total / limit)}
                onPageChange={handlePageChange}
                />
            </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default UserList
'use client'
import { useState } from 'react';
import { useListAllQuery, useDeleteTestimonialsMutation } from '../../api/testimonal.api';
import AdminTitle from '../AdminTitle/AdminTitle';
import Link from 'next/link';
import LoadingComponent from '../../common/Loading/Loading.component';
import EditButton from '../EditButton/EditButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import { Pagination } from 'flowbite-react';
import Swal from 'sweetalert2';

const AgentList = () => {
    const [search, setSearch] = useState(''); // Ensure default value is a string
    const [page, setPage] = useState(1);
    const [limit] = useState(10); 

    const {data, error, isLoading} = useListAllQuery({ page, limit, search })
    const [deleteTestimonial] = useDeleteTestimonialsMutation()
    const testimonial = data?.details || []

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value); // Update the search state
        setPage(1); // Reset to the first page
      };
    
      const handlePageChange = (newPage: number) => {
        setPage(newPage);
      };  
      const truncateContent = (content = '', wordLimit: number) => {
        const words = content.split(' ');
        return words.length > wordLimit
          ? words.slice(0, wordLimit).join(' ') + '...'
          : content;
      };    
    
      const deleteData=async(id:string)=>{
        try{
          await deleteTestimonial(id).unwrap()
          Swal.fire({
            title:"Deleted!",
            text:"Testimonial deleted successfully",
            icon:"success"
          })
        }catch(exception){
          Swal.fire({
            title:"Error!",
            text:"Cannot delete testimonial at this moment",
            icon:"error"
          })
        }    
      }
  return (
    <div className='admin_margin_box'>
      <div className='admin_titles'>
        <AdminTitle url='/admin/testimonial' label1=' Testimonial List' label2='' />
        <div className='Dashboard_title'>
          <h1>Testimonial List</h1>
          <div>
          <input
              type="search"
              className="search_btn"
              placeholder="Filter by name..."
              value={search}
              onChange={handleSearchChange}
          />
          <Link href='/admin/add_testimonial'>
            <button className='edit_btn'>Add Testimonial</button>
          </Link>          
          </div>
        </div>
      </div>
      <div className='blog_table'>        
        <table border={2}>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Image</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Comment</th>
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
            ) : testimonial && testimonial.length > 0 ? (
              testimonial.map((row: any, index: number) => (
                <tr key={index}>
                  <td className="table_sn">{index + 1}</td>
                  <td><img src={row.image} alt={row.name} width={100} height={100} /></td>
                  <td>{row.name}</td>
                  <td>{row.rating}</td>
                  <td>{truncateContent(row.review, 10)}</td>
                  <td style={{ textAlign: 'center', width: '150px' }}>
                    <EditButton editUrl={`/admin/edit_testimonial?id=${row.id}`}/>
                    <DeleteButton deleteAction={deleteData} rowId={row.id}/>                  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>Testimonial List is Empty</td>
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

export default AgentList
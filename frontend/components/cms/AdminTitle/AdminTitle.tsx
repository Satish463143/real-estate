'use client'
import './AdminTitle.css'
import Link  from 'next/link'

const AdminTitle = ({url,label1,label2}: {url: string, label1: string, label2: string}) => {
  return (
    <div>
        <div className='back_link'>
            <h4> &gt;&gt; </h4>
            <Link href='/admin/dashboard'><h4> Dashboard </h4></Link>
            <h4>/</h4>
            <Link href={url}><h4> {label1}</h4></Link>
            <h4>{label2}</h4>
        </div> 
        <div className='hr'></div>        
    </div>
  )
}

export default AdminTitle
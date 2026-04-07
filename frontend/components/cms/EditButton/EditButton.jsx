"use client"
import Link from 'next/link'

const EditButton = ({editUrl}) => {
  return (
    <Link href={editUrl}>
        <button className="edit_btn" style={{ marginBottom: '10px' }}>Edit</button>
    </Link>
  )
}

export default EditButton
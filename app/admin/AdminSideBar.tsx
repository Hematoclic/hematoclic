import React from 'react'

type Props = {
  className?: string
}

const AdminSideBar = ({ className }: Props) => {
  return (
    <div className={className}>
      <div>créer fiche</div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default AdminSideBar
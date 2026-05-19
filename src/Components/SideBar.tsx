import { DollarSign, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Calendrier from './Calendrier'

function SideBar() {
  return (
    <div className='flex flex-col gap-5 justify-between relative'>
      <div className='flex flex-col justify-center'>
        <NavLink to={"/dashboard"} title='Dashboard' className='bg-gray-200 text-xl p-2 flex items-center gap-3'> <Home /> Tabelau de bord</NavLink>
        <NavLink to={"/budget"} title='Dépense' className='bg-gray-100 text-xl p-2 flex gap-3'> <DollarSign /> Mes Dépenses</NavLink>
        <NavLink to={"/profil"} title='Profil' className='bg-gray-100 text-xl p-2 flex gap-3'> <User /> Profil</NavLink>
      </div>

      <div className=" bg-gray-100 flex">
        <Calendrier />
      </div>
    </div>
  )
}

export default SideBar

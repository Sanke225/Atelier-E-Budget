import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useDeconnexion from "../Hook/useDeconnexion";


function Navbar() {

  const [open, setOpen] = useState(false);
  const { deconnexion } = useDeconnexion()

  return (
    <div className='sticky top-0 z-50 p-2 px-10 bg-gray-100 w-full flex justify-between'>
      <div className="flex justify-center">
        <img src="/src/Images/images.png" className="w-15 " alt="" />
        <p className="flex ps-3 items-center font-bold">E-GESTION DE BUDGET</p>
      </div>


      <div className="flex justify-center items-center gap-7 relative">
        <a href="" className="relative">
          <Bell className="w-8 h-8" />
          <p className="bg-red-500 flex justify-center items-center text-center rounded-full text-white text-xs w-5 h-5 absolute -top-1 -right-2"> 3 </p>
        </a>

        {/* Profil dropdown */}
        <div className="relative">
          <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 hover:bg-base-200 p-2 rounded-xl transition">
            <img src="/src/Images/user.png" alt="profil" className="w-11 h-11 rounded-full object-cover border" />
            <ChevronDown size={18} />
          </button>

          {/* Menu */}
          {open && (
            <div className="absolute right-0 top-16 w-64 bg-white shadow-xl rounded-2xl border p-3 z-50">

              {/* Élément du menu du profil */}
              <div className="flex items-center gap-3 border-b pb-4">
                <Link to={"/profil"}>
                  <img src="/src/Images/user.png" alt="profil" className="w-14 h-14 rounded-full" />
                </Link>
                <div>
                  <h2 className="font-semibold"> Sankara Cheick Issa</h2>
                  <p className="text-sm text-gray-500">  scheickissa@gmail.com</p>
                </div>
              </div>

              {/* Options */}
              <div className="mt-3 flex flex-col gap-1">
                <Link to={"/profil"} aria-label="Voir profil" title="Voir profil" className='transition duration-500 hover:bg-gray-100 text-xl p-2 flex gap-3'> <User /> Profil</Link>
                <Link to={"/parametre"} aria-label="Voir paramètres" title="Voir paramètres" className='transition duration-500 hover:bg-gray-100 text-xl p-2 flex gap-3'> <Settings /> Paramètres</Link>
                <Link to={"/deconnexion"} onClick={deconnexion} aria-label="Se déconnecter" title="Se déconnecter" className='transition duration-500 hover:bg-orange-300 text-xl p-2 flex gap-3 bg-orange-500 rounded'> <LogOut /> Déconnexion</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

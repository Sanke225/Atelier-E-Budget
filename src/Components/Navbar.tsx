import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useDeconnexion from "../Hook/useDeconnexion";
import { UseUserStore } from "../Stores";

// Props pour contrôler l'ouverture du sidebar depuis la Navbar
type NavbarProps = {
  onMenuClick?: () => void
}

function Navbar({ onMenuClick }: NavbarProps) {
  // État pour gérer l'ouverture du dropdown profil
  const [open, setOpen] = useState(false);
  const { deconnexion } = useDeconnexion()
  const { user } = UseUserStore()

  return (
    <div className='sticky top-0 z-50 p-2 md:px-10 bg-gray-100 w-full flex justify-between items-center'>

      {/* Partie gauche - Burger + Logo */}
      <div className="flex justify-center items-center gap-3">
        {/* Menu burger - Visible uniquement sur mobile/tablette pour ouvrir le sidebar */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-base-200 rounded-xl transition"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo et titre - Adapté pour mobile */}
        <div className="flex justify-center items-center">
          <img
            src="/src/Images/logo-pwa.png"
            className="w-10 md:w-15 rounded-full"
            alt="Logo E-Gestion Budget"
          />
          {/* Texte caché sur très petits écrans */}
          <p className="hidden sm:flex ps-3 items-center font-bold text-sm md:text-base">
            E-GESTION DE BUDGET
          </p>
          {/* Version courte pour mobile */}
          <p className="flex sm:hidden ps-2 items-center font-bold text-xs">
            E-BUDGET
          </p>
        </div>
      </div>

      {/* Partie droite - Navigation */}
      <div className="flex justify-center items-center gap-3 md:gap-7 relative">

        {/* Notifications - Toujours visible */}
        <a href="#notifications" className="relative">
          <Bell className="w-6 h-6 md:w-8 md:h-8" />
          <p className="bg-red-500 flex justify-center items-center text-center rounded-full text-white text-xs w-4 h-4 md:w-5 md:h-5 absolute -top-1 -right-2">
            3
          </p>
        </a>

        {/* Profil dropdown - Toujours visible */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-base-200 p-2 rounded-xl transition"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="profil"
                className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border"
              />
            ) : (
              <div className='w-9 h-9 md:w-11 md:h-11 rounded-full bg-gray-200 border flex items-center justify-center'>
                <User size={18} className="text-gray-500" />
              </div>
            )}
            <ChevronDown size={16} className="md:block hidden" />
          </button>

          {/* Menu dropdown */}
          {open && (
            <div className="absolute right-0 top-16 w-64 bg-white shadow-xl rounded-2xl border p-3 z-50">
              {/* Élément du menu du profil */}
              <div className="flex items-center gap-3 border-b pb-4">
                <Link to={"/profil"}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="profil" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className='w-14 h-14 rounded-full bg-gray-200 border flex items-center justify-center'>
                      <User size={24} className="text-gray-500" />
                    </div>
                  )}
                </Link>
                <div>
                  <h2 className="font-semibold">{user?.nom || "Utilisateur"}</h2>
                  <p className="text-sm text-gray-500">{user?.email || "Non renseigné"}</p>
                </div>
              </div>

              {/* Options du menu */}
              <div className="mt-3 flex flex-col gap-1">
                <Link
                  to={"/profil"}
                  aria-label="Voir profil"
                  title="Voir profil"
                  className='transition duration-500 hover:bg-gray-100 text-xl p-2 flex gap-3'
                >
                  <User /> Profil
                </Link>
                <Link
                  to={"/parametre"}
                  aria-label="Voir paramètres"
                  title="Voir paramètres"
                  className='transition duration-500 hover:bg-gray-100 text-xl p-2 flex gap-3'
                >
                  <Settings /> Paramètres
                </Link>
                <Link
                  to={"/deconnexion"}
                  onClick={deconnexion}
                  aria-label="Se déconnecter"
                  title="Se déconnecter"
                  className='transition duration-500 hover:bg-orange-300 text-xl p-2 flex gap-3 bg-orange-500 rounded'
                >
                  <LogOut /> Déconnexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

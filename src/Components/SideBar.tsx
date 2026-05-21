import { DollarSign, Home, User, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Calendrier from './Calendrier'

// Props pour contrôler l'ouverture/fermeture du sidebar mobile
type SideBarProps = {
  isOpen?: boolean
  onClose?: () => void
}

function SideBar({ isOpen = false, onClose }: SideBarProps) {

  // Fonction pour fermer le menu après navigation sur mobile
  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay sombre pour mobile quand menu ouvert */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Drawer sur mobile, fixe sur desktop */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          w-72 lg:w-77.5
          py-8 lg:py-20
          bg-gray-100
          overflow-y-auto
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Bouton de fermeture - Visible uniquement sur mobile */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-lg"
          aria-label="Fermer le menu"
        >
          <X size={24} />
        </button>

        <div className='flex flex-col gap-5 justify-between h-full px-4'>
          {/* Menu de navigation - Espacement pour éviter le bouton fermer */}
          <div className='flex flex-col justify-center mt-12 lg:mt-0'>
            <NavLink
              to={"/dashboard"}
              onClick={handleLinkClick}
              title='Dashboard'
              className={({ isActive }) =>
                `text-lg lg:text-xl p-3 flex items-center gap-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-300 font-semibold'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`
              }
            >
              <Home size={20} />
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink
              to={"/budget"}
              onClick={handleLinkClick}
              title='Dépense'
              className={({ isActive }) =>
                `text-lg lg:text-xl p-3 flex items-center gap-3 rounded-lg transition-colors mt-2 ${
                  isActive
                    ? 'bg-gray-300 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`
              }
            >
              <DollarSign size={20} />
              <span>Mes Dépenses</span>
            </NavLink>

            <NavLink
              to={"/profil"}
              onClick={handleLinkClick}
              title='Profil'
              className={({ isActive }) =>
                `text-lg lg:text-xl p-3 flex items-center gap-3 rounded-lg transition-colors mt-2 ${
                  isActive
                    ? 'bg-gray-300 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`
              }
            >
              <User size={20} />
              <span>Profil</span>
            </NavLink>
          </div>

          {/* Calendrier - Caché sur mobile, visible sur desktop */}
          <div className="hidden lg:flex bg-gray-100">
            <Calendrier />
          </div>

          {/* Version mobile du calendrier (optionnel) */}
          <div className="lg:hidden bg-gray-200 p-3 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Calendrier disponible en mode desktop
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar

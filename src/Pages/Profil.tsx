import SideBar from '../Components/SideBar'
import InformationPerso from '../Components/InformationProfil'
import EditProfil from '../Components/EditProfil'

// Props pour recevoir la fonction d'ouverture du sidebar depuis App
type ProfilProps = {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

function Profil({ sidebarOpen, setSidebarOpen }: ProfilProps) {
    return (
        <div className='flex min-h-screen'>
            {/* Sidebar responsive */}
            <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Contenu principal - Adapté pour mobile */}
            <div className='flex-1 lg:ml-77.5 w-full flex flex-col px-4 md:px-6 lg:px-10 py-6 md:py-10 lg:py-20'>
                {/* Header - Responsive */}
                <div className="mb-6">
                    <h1 className='text-2xl md:text-3xl font-bold'>Mon profil</h1>
                    <p className='text-xs md:text-sm font-mono text-gray-500 mt-1'>Voici les informations de votre profil</p>
                </div>

                {/* Informations personnelles */}
                <div className='mb-6'>
                    <InformationPerso />
                </div>

                {/* Édition du profil */}
                <div>
                    <EditProfil />
                </div>
            </div>
        </div>
    )
}

export default Profil

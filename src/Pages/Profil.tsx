import SideBar from '../Components/SideBar'
import InformationPerso from '../Components/InformationProfil'
import EditProfil from '../Components/EditProfil'

function Profil() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-[310px_1fr]'>
            <div className="flex min-h-screen">
                <div className="fixed top-0 left-0 w-77.5 h-screen py-20 flex justify-start bg-gray-100 overflow-y-auto">
                    <SideBar />
                </div>
                <div className="ml-77.5 flex-1 text-start px-10 py-20">

                </div>
            </div>
            <div className='flex flex-col px-10 py-20'>
                <div>
                    <h1 className="text-3xl font-serif ms-4">Mon profil</h1>
                    <p className="ms-4 text-sm font-mono text-gray-500"> Voici les informations de votre profil </p>
                </div>

                <div className='my-10 max-w-4xl'>
                    <InformationPerso />
                </div>

                <div>
                    <EditProfil />
                </div>
            </div>
        </div>
    )
}

export default Profil

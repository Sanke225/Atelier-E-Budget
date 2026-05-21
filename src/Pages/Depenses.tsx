import ListeDepenses from "../Components/ListeDepenses"
import SideBar from "../Components/SideBar"
import AjoutDepenses from "../Components/AjoutDepenses"
import ResteTotal from "../Components/ResteTotal"
import DepenseDuMois from "../Components/DepenseMensuelleCard"
import BudgetTotalDuMois from "../Components/BudgetTotalDuMois"
import EpargneDuMois from "../Components/EpargneTotalcard"
import { useState } from "react"

// Props pour recevoir la fonction d'ouverture du sidebar depuis App
type DepensesProps = {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

function Depenses({ sidebarOpen, setSidebarOpen }: DepensesProps) {
    // État pour gérer l'ouverture du modal
    const [showAddDepenseModal, setShowAddDepenseModal] = useState(false)

    // État pour gérer le filtre actif
    const [filtreActif, setFiltreActif] = useState<string>("")

    console.log(import.meta.env.VITE_FIREBASE_API_KEY)


    return (
        <div className="flex min-h-screen">
            {/* Sidebar responsive */}
            <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Contenu principal - Adapté pour mobile */}
            <div className="flex-1 lg:ml-77.5 w-full text-start px-4 md:px-6 lg:px-10 py-6 md:py-10 lg:py-20">

                {/* Header - Responsive */}
                <div className="mb-6">
                    <h1 className='text-2xl md:text-3xl font-bold'>Dépenses</h1>
                    <p className='text-xs md:text-sm font-mono text-gray-500 mt-1'>La liste de toutes les dépenses</p>
                </div>

                {/* Cartes statistiques - Carrousel sur mobile, Grid sur desktop */}
                <div className="mb-6">
                    {/* Carrousel mobile */}
                    <div className="md:hidden">
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide px-1">
                            <div className="snap-center shrink-0 w-[85%] h-full">
                                <div className="h-full">
                                    <ResteTotal />
                                </div>
                            </div>
                            <div className="snap-center shrink-0 w-[85%] h-full">
                                <div className="h-full">
                                    <DepenseDuMois />
                                </div>
                            </div>
                            <div className="snap-center shrink-0 w-[85%] h-full">
                                <div className="h-full">
                                    <BudgetTotalDuMois />
                                </div>
                            </div>
                            <div className="snap-center shrink-0 w-[85%] h-full">
                                <div className="h-full">
                                    <EpargneDuMois />
                                </div>
                            </div>
                        </div>
                        {/* Indicateur de swipe */}
                        <div className="flex justify-center gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                    </div>

                    {/* Grid desktop */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                        <ResteTotal />
                        <DepenseDuMois />
                        <BudgetTotalDuMois />
                        <EpargneDuMois />
                    </div>
                </div>

                {/* Bouton Ajouter une dépense - Aligné à droite */}
                <div className="flex justify-end mb-5">
                    <button
                        type="button"
                        onClick={() => setShowAddDepenseModal(true)}
                        className="btn btn-neutral btn-xs md:btn-sm whitespace-nowrap"
                    >
                        Ajouter une dépense
                    </button>
                </div>

                {/* Filtres - Responsive avec wrap */}
                <div className='mb-5'>
                    <div className='flex flex-wrap gap-2 md:gap-3'>
                        <button
                            type="button"
                            onClick={() => setFiltreActif(filtreActif === "jour" ? "" : "jour")}
                            className={`btn btn-xs md:btn-sm rounded-3xl ${filtreActif === "jour" ? "btn-neutral" : "btn-outline"}`}
                        >
                            Jour
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltreActif(filtreActif === "semaine" ? "" : "semaine")}
                            className={`btn btn-xs md:btn-sm rounded-3xl ${filtreActif === "semaine" ? "btn-neutral" : "btn-outline"}`}
                        >
                            Semaine
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltreActif(filtreActif === "mois" ? "" : "mois")}
                            className={`btn btn-xs md:btn-sm rounded-3xl ${filtreActif === "mois" ? "btn-neutral" : "btn-outline"}`}
                        >
                            Mois
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltreActif(filtreActif === "annee" ? "" : "annee")}
                            className={`btn btn-xs md:btn-sm rounded-3xl ${filtreActif === "annee" ? "btn-neutral" : "btn-outline"}`}
                        >
                            Année
                        </button>
                        {filtreActif && (
                            <button
                                type="button"
                                onClick={() => setFiltreActif("")}
                                className="btn btn-xs md:btn-sm rounded-3xl btn-error"
                            >
                                × Réinitialiser
                            </button>
                        )}
                    </div>
                </div>

                {/* Liste des dépenses */}
                <div className="mb-6">
                    <ListeDepenses filtreActif={filtreActif} />
                </div>

                {/* Modal */}
                <AjoutDepenses
                    isOpen={showAddDepenseModal}
                    onClose={() => setShowAddDepenseModal(false)}
                />
            </div>
        </div>
    )
}

export default Depenses

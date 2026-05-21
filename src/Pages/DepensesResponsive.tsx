import ListeDepenses from "../Components/ListeDepenses"
import SideBarResponsive from "../Components/SideBarResponsive"
import AjoutDepenses from "../Components/AjoutDepenses"
import ResteTotal from "../Components/ResteTotal"
import DepenseDuMois from "../Components/DepenseMensuelleCard"
import BudgetTotalDuMois from "../Components/BudgetTotalDuMois"
import EpargneDuMois from "../Components/EpargneTotalcard"

function DepensesResponsive() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar responsive */}
            <SideBarResponsive />

            {/* Contenu principal - Adapté pour mobile */}
            <div className="flex-1 lg:ml-77.5 w-full">
                <div className="px-4 md:px-6 lg:px-10 py-6 md:py-10 lg:py-20">

                    {/* Header - Responsive */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex flex-col">
                            <h1 className='text-2xl md:text-3xl font-bold'>Dépenses</h1>
                            <p className='text-xs md:text-sm font-mono text-gray-500 mt-1'>
                                La liste de toutes les dépenses
                            </p>
                        </div>

                        <a
                            href="#ajout-depense-modal"
                            className="btn btn-neutral w-full sm:w-auto"
                        >
                            Ajouter une dépense
                        </a>
                    </div>

                    {/* Cartes statistiques - Grid responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
                        <ResteTotal />
                        <DepenseDuMois />
                        <BudgetTotalDuMois />
                        <EpargneDuMois />
                    </div>

                    {/* Filtres - Responsive avec wrap */}
                    <div className="mb-5">
                        <form className='flex flex-wrap gap-2 md:gap-3'>
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="checkbox"
                                name="frameworks"
                                aria-label="Jour"
                            />
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="checkbox"
                                name="frameworks"
                                aria-label="Semaine"
                            />
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="checkbox"
                                name="frameworks"
                                aria-label="Mois"
                            />
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="checkbox"
                                name="frameworks"
                                aria-label="Année"
                            />
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="checkbox"
                                name="frameworks"
                                aria-label="Date-1 - Date 2"
                            />
                            <input
                                className="btn btn-xs md:btn-sm rounded-3xl"
                                type="reset"
                                value="×"
                            />
                        </form>
                    </div>

                    {/* Liste des dépenses */}
                    <div className="mb-5">
                        <ListeDepenses />
                    </div>

                    {/* Modal d'ajout de dépenses */}
                    <AjoutDepenses />
                </div>
            </div>
        </div>
    )
}

export default DepensesResponsive

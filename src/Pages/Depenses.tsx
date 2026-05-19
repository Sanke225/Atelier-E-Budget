import ListeDepenses from "../Components/ListeDepenses"
import SideBar from "../Components/SideBar"
import AjoutDepenses from "../Components/AjoutDepenses"
import ResteTotal from "../Components/ResteTotal"
import DepenseDuMois from "../Components/DepenseMensuelleCard"
import BudgetTotalDuMois from "../Components/BudgetTotalDuMois"
import EpargneDuMois from "../Components/EpargneTotalcard"

function Depenses() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[310px_1fr]">
            <div className="flex min-h-screen">
                <div className="fixed top-0 left-0 w-77.5 h-screen py-20 flex justify-start bg-gray-100 overflow-y-auto">
                    <SideBar />
                </div>
                <div className="ml-77.5 flex-1 text-start px-10 py-20">

                </div>
            </div>

            <div className="mx-10 my-20 max-w-7xl ">
                <div className="flex justify-between">
                    <div className="flex flex-col justify-between">
                        <h1 className='text-3xl font-bold ms-4'>Dépenses</h1>
                        <p className='ms-4 text-sm font-mono text-gray-500'>La liste de toutes les dépenses</p>
                    </div>

                    <div className="flex justify-end">
                        <a href="#ajout-depense-modal" className="btn btn-neutral my-2">Ajouter une dépense</a>
                    </div>
                </div>

                <div className="flex gap-5 my-5 mx-4">
                    <ResteTotal />
                    <DepenseDuMois />
                    <BudgetTotalDuMois />
                    <EpargneDuMois />
                </div>

                <div className=''>

                    <form className='flex gap-3'>
                        <input className="btn btn-xs rounded-3xl " type="checkbox" name="frameworks" aria-label="Jour" />
                        <input className="btn btn-xs rounded-3xl" type="checkbox" name="frameworks" aria-label="Semaine" />
                        <input className="btn btn-xs rounded-3xl" type="checkbox" name="frameworks" aria-label="Mois" />
                        <input className="btn btn-xs rounded-3xl" type="checkbox" name="frameworks" aria-label="Année" />
                        <input className="btn btn-xs rounded-3xl" type="checkbox" name="frameworks" aria-label="Date-1 - Date 2 " />
                        <input className="btn btn-xs rounded-3xl" type="reset" value="×" />
                    </form>
                </div>

                <div className="my-5">
                    <ListeDepenses />
                </div>

                <div>
                    <AjoutDepenses />
                </div>
            </div>
        </div>
    )
}

export default Depenses

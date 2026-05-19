import Ajoutbudget from "../Components/Ajoutbudget"
import SideBar from "../Components/SideBar"
import { BudgetStore } from "../Stores"
import { Delete, Edit, PlusCircle } from "lucide-react"
import axios from "axios"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"
import EditButton from "../Components/EditButton"
import HistoriqueDesDepenses from "../Components/HistoriqueDesDepenses"
import ResteTotal from "../Components/ResteTotal.tsx"
import BudgetTotalDuMois from "../Components/BudgetTotalDuMois.tsx"
import DepenseDuMois from "../Components/DepenseMensuelleCard.tsx"
import EpargneDuMois from "../Components/EpargneTotalcard.tsx"
import GraphiqueDepenses from "../Components/GraphiqueDepenses.tsx"


function Dashboard() {
    const budget = BudgetStore(state => state.budget)
    const deleteBudget = BudgetStore(state => state.deleteBudget)

    const buttonDelete = async (id: string) => {
        try {
            const serveur = import.meta.env.VITE_databaseURL
            await axios.delete(`${serveur}/budget/${id}.json`)
            deleteBudget(id)
            Toastsuccess("Budget supprimé avec succès")
        } catch (error) {
            Toasterror("Erreur lors de la suppression")
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-[310px_1fr]">
            <div className="flex min-h-screen">
                <div className="fixed top-0 left-0 w-77.5 h-screen py-20 flex justify-start bg-gray-100 overflow-y-auto">
                    <SideBar />
                </div>
                <div className="ml-77.5 flex-1 text-start px-10 py-20">

                </div>
            </div>
            <div className="text-start px-10 py-20 ">
                <div className="flex justify-between items-center max-w-7xl">
                    <h2 className="font-bold text-3xl">Tableau de bord</h2>
                    <a href="#ajout-budget-modal" className="btn btn-neutral my-5">Ajouter un budget</a>
                </div>
                <div className="flex gap-5">
                    <BudgetTotalDuMois />
                    <ResteTotal />
                    <DepenseDuMois />
                    <EpargneDuMois />
                </div>

                <h3 className="text-xl mb-3">Mes budgets</h3>
                <div className="overflow-x-auto max-w-7xl flex gap-3">
                    <table className="table max-w-3xl w-full">
                        <thead className="bg-gray-100">
                            <tr className="text-neutral-900 font-mono">
                                <th>Budget</th>
                                <th>Montant initial</th>
                                <th>Dépense</th>
                                <th>Reste</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget && budget.length > 0 ? (
                                budget.map(item => (
                                    <tr key={item.id}>
                                        <th>{item.tittre}</th>
                                        <td>{item.montant} F CFA</td>
                                        <td>{item.depense}</td>
                                        <td>{item.reste} F CFA</td>
                                        <td className="flex flex-row gap-2 items-center">
                                            <button type="button" title="Ajouter un budget" aria-label="Ajouter un budget" className="btn btn-whithe">
                                                <PlusCircle />
                                            </button>
                                            <button type="button" title="Modifier le budget" className="btn btn-neutral" onClick={() => (document.getElementById(`edit-budget-modal-${item.id}`) as HTMLDialogElement)?.showModal()} >
                                                <Edit />
                                            </button>
                                            <EditButton budget={item} />
                                            <button type="button" title="Supprimer le budget" aria-label="Supprimer budget" className="btn bg-orange-500" onClick={() => buttonDelete(item.id!)} >
                                                <Delete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center'>
                                        Aucun budget trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div>
                        <GraphiqueDepenses />
                    </div>
                </div>
                <div className="mt-10">
                    <p className='text-xl mb-5'>L'historique de vos 10 dernières dépenses récent</p>
                    <HistoriqueDesDepenses />
                </div>
            </div>
            <Ajoutbudget />

        </div>
    )
}

export default Dashboard
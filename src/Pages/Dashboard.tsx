import Ajoutbudget from "../Components/Ajoutbudget"
import AjoutDepenses from "../Components/AjoutDepenses"
import SideBar from "../Components/SideBar"
import { BudgetStore, UseUserStore } from "../Stores"
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
import { useEffect, useState } from "react"
import type { BudgetType } from "../Types"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"

// Props pour recevoir la fonction d'ouverture du sidebar depuis App
type DashboardProps = {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

function Dashboard({ sidebarOpen, setSidebarOpen }: DashboardProps) {
    const budget = BudgetStore(state => state.budget)
    const deleteBudget = BudgetStore(state => state.deleteBudget)
    const updateBudget = BudgetStore(state => state.updateBudget)
    const user = UseUserStore(state => state.user)

    // États pour gérer l'ouverture des modals
    const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
    const [showAddDepenseModal, setShowAddDepenseModal] = useState(false)
    const [selectedCategorie, setSelectedCategorie] = useState<string>("")

    // État pour stocker les dépenses par catégorie en temps réel
    const [depensesParCategorie, setDepensesParCategorie] = useState<{ [key: string]: number }>({})

    // Chargement des budgets depuis Firebase au démarrage
    useEffect(() => {
        const chargerBudgets = async () => {
            try {
                const serveur = import.meta.env.VITE_databaseURL
                const response = await axios.get(`${serveur}/budget.json`)
                const data = response.data

                if (data) {
                    // Convertir l'objet Firebase en tableau
                    const budgetsArray: BudgetType[] = Object.keys(data)
                        .map(key => ({
                            ...data[key],
                            id: key
                        }))
                        .filter(item => item.idUser === user?.uid)

                    // Mettre à jour le store uniquement si différent
                    budgetsArray.forEach(item => {
                        if (!budget.find(b => b.id === item.id)) {
                            updateBudget(item)
                        }
                    })
                }
            } catch (error) {
                console.error("Erreur lors du chargement des budgets:", error)
            }
        }

        if (user?.uid) {
            chargerBudgets()
        }
    }, [user?.uid])

    // Écoute des dépenses en temps réel pour calculer les totaux par catégorie
    useEffect(() => {
        const depenseRef = ref(database, "depenses")
        const unsubscribe = onValue(depenseRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const depensesList = Object.entries(data).map(([id, value]: any) => ({ id, ...value }))

                // Calculer le total des dépenses par catégorie
                const totaux: { [key: string]: number } = {}
                depensesList.forEach((depense: any) => {
                    const categorie = depense.categorie
                    if (categorie) {
                        totaux[categorie] = (totaux[categorie] || 0) + Number(depense.depense || 0)
                    }
                })

                setDepensesParCategorie(totaux)
            } else {
                setDepensesParCategorie({})
            }
        })

        return () => unsubscribe()
    }, [])

    // Fonction pour obtenir les données calculées d'un budget
    const getBudgetCalcule = (budgetItem: BudgetType) => {
        const depenseTotale = depensesParCategorie[budgetItem.tittre] || 0
        const reste = budgetItem.montant - depenseTotale
        return {
            montant: budgetItem.montant,
            depense: depenseTotale,
            reste: reste
        }
    }

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
        <div className="flex min-h-screen">
            {/* Sidebar responsive */}
            <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {/* Contenu principal - Adapté pour mobile */}
            <div className="flex-1 lg:ml-77.5 w-full text-start px-4 md:px-6 lg:px-10 py-6 md:py-10 lg:py-20">

                {/* Header - Responsive */}
                <div className="mb-6">
                    <h2 className="font-bold text-2xl md:text-3xl">Tableau de bord</h2>
                </div>

                {/* Cartes statistiques - Carrousel sur mobile, Grid sur desktop */}
                <div className="mb-6">
                    {/* Carrousel mobile */}
                    <div className="md:hidden">
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide px-1">
                            <div className="snap-center shrink-0 w-[85%] h-full">
                                <div className="h-full">
                                    <BudgetTotalDuMois />
                                </div>
                            </div>
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
                        <BudgetTotalDuMois />
                        <ResteTotal />
                        <DepenseDuMois />
                        <EpargneDuMois />
                    </div>
                </div>

                {/* Section Mes budgets avec bouton Ajouter */}
                <div className="flex flex-row justify-between items-center gap-3 mb-4">
                    <h3 className="text-lg md:text-xl">Mes budgets</h3>
                    <button
                        type="button"
                        onClick={() => setShowAddBudgetModal(true)}
                        className="btn btn-neutral btn-xs md:btn-sm whitespace-nowrap"
                    >
                        Ajouter un budget
                    </button>
                </div>

                {/* Container du tableau et graphique - Responsive */}
                <div className="flex flex-col xl:flex-row gap-5 mb-6">

                    {/* Tableau - Version desktop (caché sur mobile) */}
                    <div className="hidden md:block flex-1 overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-100">
                                <tr className="text-neutral-900 font-mono">
                                    <th className="text-sm lg:text-base">Budget</th>
                                    <th className="text-sm lg:text-base">Montant initial</th>
                                    <th className="text-sm lg:text-base">Dépense</th>
                                    <th className="text-sm lg:text-base">Reste</th>
                                    <th className="text-sm lg:text-base">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budget && budget.length > 0 ? (
                                    budget.map(item => {
                                        const budgetCalcule = getBudgetCalcule(item)
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <th className="text-sm lg:text-base">{item.tittre}</th>
                                                <td className="text-sm lg:text-base">{budgetCalcule.montant} F CFA</td>
                                                <td className="text-sm lg:text-base">{budgetCalcule.depense} F CFA</td>
                                                <td className="text-sm lg:text-base">{budgetCalcule.reste} F CFA</td>
                                            <td>
                                                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCategorie(item.tittre)
                                                            setShowAddDepenseModal(true)
                                                        }}
                                                        title="Ajouter une dépense"
                                                        aria-label="Ajouter une dépense"
                                                        className="btn btn-sm lg:btn-md btn-white"
                                                    >
                                                        <PlusCircle size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Modifier le budget"
                                                        className="btn btn-sm lg:btn-md btn-neutral"
                                                        onClick={() => setEditingBudgetId(item.id!)}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Supprimer le budget"
                                                        aria-label="Supprimer budget"
                                                        className="btn btn-sm lg:btn-md bg-orange-500 hover:bg-orange-600"
                                                        onClick={() => buttonDelete(item.id!)}
                                                    >
                                                        <Delete size={18} />
                                                    </button>
                                                </div>
                                                {/* Modal géré par state */}
                                                <EditButton
                                                    budget={item}
                                                    isOpen={editingBudgetId === item.id}
                                                    onClose={() => setEditingBudgetId(null)}
                                                />
                                            </td>
                                        </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className='text-center py-8'>
                                            Aucun budget trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Version mobile - Cartes (visible uniquement sur mobile) */}
                    <div className="md:hidden flex flex-col gap-4">
                        {budget && budget.length > 0 ? (
                            budget.map(item => {
                                const budgetCalcule = getBudgetCalcule(item)
                                return (
                                    <div key={item.id} className="card bg-white shadow-md border p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-lg">{item.tittre}</h4>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    title="Modifier"
                                                    className="btn btn-xs btn-neutral"
                                                    onClick={() => setEditingBudgetId(item.id!)}
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Supprimer"
                                                    className="btn btn-xs bg-orange-500 hover:bg-orange-600"
                                                    onClick={() => buttonDelete(item.id!)}
                                                >
                                                    <Delete size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Montant initial:</span>
                                                <span className="font-semibold">{budgetCalcule.montant} F CFA</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Dépense:</span>
                                                <span className="font-semibold">{budgetCalcule.depense} F CFA</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Reste:</span>
                                                <span className={`font-semibold ${budgetCalcule.reste >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {budgetCalcule.reste} F CFA
                                                </span>
                                            </div>
                                        </div>

                                    {/* Bouton Ajouter une dépense - Aligné à droite */}
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategorie(item.tittre)
                                                setShowAddDepenseModal(true)
                                            }}
                                            className="btn btn-neutral btn-xs md:btn-sm whitespace-nowrap"
                                        >
                                            <PlusCircle size={14} />
                                            Ajouter une dépense
                                        </button>
                                    </div>
                                    {/* Modal géré par state */}
                                    <EditButton
                                        budget={item}
                                        isOpen={editingBudgetId === item.id}
                                        onClose={() => setEditingBudgetId(null)}
                                    />
                                </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Aucun budget trouvé
                            </div>
                        )}
                    </div>

                    {/* Graphique - Responsive */}
                    <div className="w-full xl:w-96">
                        <GraphiqueDepenses />
                    </div>
                </div>

                {/* Historique des dépenses */}
                <div className="mt-8 md:mt-10">
                    <p className='text-lg md:text-xl mb-5'>
                        L'historique de vos 10 dernières dépenses récentes
                    </p>
                    <HistoriqueDesDepenses />
                </div>
            </div>

            {/* Modals */}
            <Ajoutbudget isOpen={showAddBudgetModal} onClose={() => setShowAddBudgetModal(false)} />
            <AjoutDepenses
                isOpen={showAddDepenseModal}
                onClose={() => {
                    setShowAddDepenseModal(false)
                    setSelectedCategorie("")
                }}
                categoriePredefinie={selectedCategorie}
            />
        </div>
    )
}

export default Dashboard
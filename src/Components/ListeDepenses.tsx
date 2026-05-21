import { useEffect, useState, useMemo } from "react"
import { DepenseStore } from "../Stores"
import { onValue, ref, remove } from "firebase/database"
import { database } from "../firebase"
import { Delete, Edit } from "lucide-react"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"
import EditDepense from "./EditDepense"
import type { DepenseType } from "../Types"

type ListeDepensesProps = {
    filtreActif?: string
}

function ListeDepenses({ filtreActif = "" }: ListeDepensesProps) {

    const depenses = DepenseStore((state) => state.depenses)
    const setDepenses = DepenseStore((state) => state.setDepenses)
    const removeDepense = DepenseStore((state) => state.removeDepense)

    // État pour gérer l'édition
    const [editingDepenseId, setEditingDepenseId] = useState<string | null>(null)

    useEffect(() => {

        const depRef = ref(database, "depenses")

        const unsubscribe = onValue(depRef, (snapshot) => {

            const data = snapshot.val()
            const formatted = data
                ? Object.entries(data).map(([id, value]: any) => ({
                    id,
                    ...value
                }))
                : []

            setDepenses(formatted)
        })

        return () => unsubscribe()

    }, [])

    // Fonction pour supprimer une dépense
    const handleDelete = async (id: string) => {
        try {
            const depenseRef = ref(database, `depenses/${id}`)
            await remove(depenseRef)
            removeDepense(id)
            Toastsuccess("Dépense supprimée avec succès")
        } catch (error) {
            console.error(error)
            Toasterror("Erreur lors de la suppression")
        }
    }

    // Fonction pour filtrer les dépenses selon la période
    const depensesFiltrees = useMemo(() => {
        if (!filtreActif) return depenses

        const now = new Date()
        const aujourdhui = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        return depenses.filter((depense: DepenseType) => {
            if (!depense.createdAt) return false

            const dateDepense = new Date(depense.createdAt)
            const dateDepenseJour = new Date(dateDepense.getFullYear(), dateDepense.getMonth(), dateDepense.getDate())

            switch (filtreActif) {
                case "jour":
                    // Dépenses du jour actuel
                    return dateDepenseJour.getTime() === aujourdhui.getTime()

                case "semaine":
                    // Dépenses des 7 derniers jours
                    const debutSemaine = new Date(aujourdhui)
                    debutSemaine.setDate(aujourdhui.getDate() - 7)
                    return dateDepenseJour >= debutSemaine && dateDepenseJour <= aujourdhui

                case "mois":
                    // Dépenses du mois actuel
                    return dateDepense.getMonth() === now.getMonth() &&
                           dateDepense.getFullYear() === now.getFullYear()

                case "annee":
                    // Dépenses de l'année actuelle
                    return dateDepense.getFullYear() === now.getFullYear()

                default:
                    return true
            }
        })
    }, [depenses, filtreActif])

    return (
        <div>
            {/* Tableau desktop - Visible uniquement sur tablette et desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-gray-100 font-mono">
                            <th className="text-sm lg:text-base">Catégorie</th>
                            <th className="text-sm lg:text-base">Titre</th>
                            <th className="text-sm lg:text-base">Montant</th>
                            <th className="text-sm lg:text-base">Date</th>
                            <th className="text-sm lg:text-base">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {depensesFiltrees.length > 0 ? (
                            depensesFiltrees.map((item) => (
                                <tr key={item.id}>
                                    <td className="font-semibold text-sm lg:text-base">{item.categorie || "-"}</td>
                                    <td className="text-sm lg:text-base">{item.titre}</td>
                                    <td className="text-sm lg:text-base">{item.depense.toLocaleString('fr-FR')} F CFA</td>
                                    <td className="text-sm lg:text-base">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : "-"}
                                    </td>
                                    <td>
                                        <div className="flex flex-row gap-1 lg:gap-2 items-center">
                                            <button
                                                type="button"
                                                title="Modifier la dépense"
                                                className="btn btn-sm lg:btn-md btn-neutral"
                                                onClick={() => setEditingDepenseId(item.id!)}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Supprimer la dépense"
                                                aria-label="Supprimer dépense"
                                                className="btn btn-sm lg:btn-md bg-orange-500 hover:bg-orange-600"
                                                onClick={() => handleDelete(item.id!)}
                                            >
                                                <Delete size={18} />
                                            </button>
                                        </div>
                                        {/* Modal d'édition */}
                                        <EditDepense
                                            depense={item}
                                            isOpen={editingDepenseId === item.id}
                                            onClose={() => setEditingDepenseId(null)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8">
                                    Aucune dépense
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Version mobile - Cartes (visible uniquement sur mobile) */}
            <div className="md:hidden flex flex-col gap-4">
                {depensesFiltrees.length > 0 ? (
                    depensesFiltrees.map((item) => (
                        <div key={item.id} className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm p-4 min-h-[140px] flex flex-col justify-between">
                            {/* Décoration */}
                            <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-orange-100 opacity-60 pointer-events-none" />

                            <div className="flex flex-col gap-2 relative z-10">
                                {/* Catégorie */}
                                <div>
                                    <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">
                                        {item.categorie || "Sans catégorie"}
                                    </span>
                                </div>

                                {/* Titre et montant */}
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-semibold text-base text-gray-900 flex-1 line-clamp-2">
                                        {item.titre}
                                    </h4>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-xl text-orange-600 whitespace-nowrap">
                                            {item.depense.toLocaleString('fr-FR')}
                                        </span>
                                        <span className="text-xs text-gray-500">F CFA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date et boutons en bas */}
                            <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        title="Modifier"
                                        className="btn btn-xs btn-neutral"
                                        onClick={() => setEditingDepenseId(item.id!)}
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        title="Supprimer"
                                        className="btn btn-xs bg-orange-500 hover:bg-orange-600"
                                        onClick={() => handleDelete(item.id!)}
                                    >
                                        <Delete size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal d'édition pour mobile */}
                            <EditDepense
                                depense={item}
                                isOpen={editingDepenseId === item.id}
                                onClose={() => setEditingDepenseId(null)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Aucune dépense
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListeDepenses
import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"
import type { DepenseType } from "../Types"

const HistoriqueDesDepenses = () => {
    const [depenses, setDepenses] = useState<DepenseType[]>([])

    useEffect(() => {
        const depRef = ref(database, "depenses")
        const unsubscribe = onValue(depRef, (snapshot) => {
            const data = snapshot.val()
            const formatted: DepenseType[] = data
                ? Object.entries(data).map(([id, value]: any) => ({ id, ...value }))
                : []

            // Trier par date décroissante et garder les 10 dernières
            const dix = formatted
                .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                .slice(0, 10)

            setDepenses(dix)
        })
        return () => unsubscribe()
    }, [])

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
                        </tr>
                    </thead>
                    <tbody>
                        {depenses.length > 0 ? (
                            depenses.map((item) => (
                                <tr key={item.id}>
                                    <td className="font-semibold text-sm lg:text-base">{item.categorie || "-"}</td>
                                    <td className="text-sm lg:text-base">{item.titre}</td>
                                    <td className="text-sm lg:text-base">{item.depense} FCFA</td>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8">
                                    Aucune dépense
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Version mobile - Carrousel (visible uniquement sur mobile) */}
            <div className="md:hidden">
                {depenses.length > 0 ? (
                    <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide px-1">
                        {depenses.map((item) => (
                            <div key={item.id} className="snap-center shrink-0 w-[85%]">
                                <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm p-4 min-h-[140px] flex flex-col justify-between">
                                    {/* Décoration */}
                                    <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-orange-100 opacity-60 pointer-events-none" />

                                    <div className="flex flex-col gap-2 relative z-10">
                                        {/* Catégorie */}
                                        <span className="inline-block w-fit px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">
                                            {item.categorie || "Sans catégorie"}
                                        </span>

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

                                    {/* Date en bas */}
                                    <div className="flex items-center gap-1 text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">
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
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Aucune dépense
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistoriqueDesDepenses
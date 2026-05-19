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
            <table className="table table-zebra w-full">
                <thead>
                    <tr className="bg-gray-100 font-mono">
                        <th>Catégorie</th>
                        <th>Titre</th>
                        <th>Montant</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {depenses.length > 0 ? (
                        depenses.map((item) => (
                            <tr key={item.id}>
                                <td className="font-semibold">{item.categorie || "-"}</td>
                                <td>{item.titre}</td>
                                <td>{item.depense} FCFA</td>
                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString()
                                        : "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                Aucune dépense
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default HistoriqueDesDepenses
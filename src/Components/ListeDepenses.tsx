import { useEffect } from "react"
import { DepenseStore } from "../Stores"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"
import { Delete, Edit } from "lucide-react"

function ListeDepenses() {

    const depenses = DepenseStore((state) => state.depenses)
    const setDepenses = DepenseStore((state) => state.setDepenses)

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

    return (
        <div>

            <table className="table table-zebra w-full">

                <thead>
                    <tr className="bg-gray-100 font-mono">
                        <th>ID</th>
                        <th>Catégorie</th>
                        <th>Titre</th>
                        <th>Montant</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {depenses.length > 0 ? (
                        depenses.map((item) => (
                            <tr key={item.id}>

                                <th className="text-gray-300 text-xs">{item.id}</th>

                                <td className="font-semibold">{item.categorie || "-"}</td>

                                <td>{item.titre}</td>

                                <td>{item.depense} FCFA</td>

                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString()
                                        : "-"}
                                </td>
                                <td className="flex flex-row gap-2 items-center">
                                    <button type="button" title="Modifier le budget" className="btn btn-neutral">
                                        <Edit />
                                    </button>
                                    <button type="button" title="Supprimer le budget" aria-label="Supprimer budget" className="btn bg-orange-500">
                                        <Delete />
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">
                                Aucune dépense
                            </td>
                        </tr>
                    )}

                </tbody>

            </table>

        </div>
    )
}

export default ListeDepenses
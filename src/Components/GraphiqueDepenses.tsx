import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const GraphiqueDepenses = () => {
    const [data, setData] = useState<{ nom: string, montant: number, depense: number }[]>([])

    const now = new Date()
    const moisActuel = now.getMonth()
    const anneeActuelle = now.getFullYear()

    useEffect(() => {
        const budgetRef = ref(database, "budget")
        const EcouteBudget = onValue(budgetRef, (snapshot) => {
            const dataBudget = snapshot.val()
            if (!dataBudget) return

            const budgets = Object.entries(dataBudget).map(([id, value]: any) => ({
                id,
                ...value
            }))

            const depenseRef = ref(database, "depenses")
            onValue(depenseRef, (snapDepense) => {
                const dataDepense = snapDepense.val()

                // Filtrage dépenses du mois actuel
                const depensesMois = dataDepense
                    ? Object.entries(dataDepense)
                        .map(([id, value]: any) => ({ id, ...value }))
                        .filter((item) => {
                            const date = new Date(item.createdAt)

                            console.log("date:", date, "mois:", date.getMonth(), "attendu:", moisActuel)
                            return (
                                date.getMonth() === moisActuel &&
                                date.getFullYear() === anneeActuelle
                            )
                        })
                    : []

                // Liaison par categorie (dépenses) === tittre (budget)
                const graphData = budgets.map((budget) => {
                    const totalDepense = depensesMois
                        .filter((d) => {
                            // ← Log temporaire
                            console.log("categorie dépense:", d.categorie, "| tittre budget:", budget.tittre, "| match:", d.categorie === budget.tittre)
                            return d.categorie === budget.tittre
                        })
                        .reduce((acc, d) => acc + Number(d.depense || 0), 0)

                    return {
                        nom: budget.tittre,
                        montant: Number(budget.montant || 0),
                        depense: totalDepense
                    }
                })

                setData(graphData)
            })
        })

        return () => EcouteBudget()
    }, [])

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-[220%] h-full flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-1">
                Budgets vs Dépenses
            </p>
            <p className="text-xs text-gray-400 mb-4">
                {MOIS[moisActuel]} {anneeActuelle}
            </p>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                        formatter={(value, name) => [
                            `${Number(value).toLocaleString("fr-FR")} F CFA`,
                            name === "montant" ? "Budget alloué" : "Dépensé"
                        ]}
                    />
                    <Bar dataKey="montant" fill="#000" radius={[4, 4, 0, 0]} name="montant" />
                    <Bar dataKey="depense" fill="#ef6706" radius={[4, 4, 0, 0]} name="depense" />
                </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-neutral" />
                    <span className="text-xs text-gray-400">Budget alloué</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-orange-500" />
                    <span className="text-xs text-gray-400">Dépensé</span>
                </div>
            </div>
        </div>
    )
}

export default GraphiqueDepenses
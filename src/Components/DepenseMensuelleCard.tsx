import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"
import { Toasterror } from "../Controllers/ToastEmmiter"

const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const DepenseDuMois = () => {
    const [depensesMoisActuel, setDepensesMoisActuel] = useState(0)
    const [depensesMoisPasse, setDepensesMoisPasse] = useState(0)

    const now = new Date()
    const moisActuel = now.getMonth()      // 0-11
    const anneeActuelle = now.getFullYear()

    // Mois précédent
    const moisPasse = moisActuel === 0 ? 11 : moisActuel - 1
    const anneePasse = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle

    useEffect(() => {
        try {
            const depenseRef = ref(database, "depenses")
            const Ecoute = onValue(depenseRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    const liste = Object.entries(data).map(([id, value]: any) => ({ id, ...value }))

                    // Filtrage mois actuel
                    const totalActuel = liste
                        .filter((item) => {
                            const date = new Date(item.createdAt)
                            return (
                                date.getMonth() === moisActuel &&
                                date.getFullYear() === anneeActuelle
                            )
                        })
                        .reduce((acc, item) => acc + Number(item.depense || 0), 0)

                    // Filtrage mois passé
                    const totalPasse = liste
                        .filter((item) => {
                            const date = new Date(item.createdAt)
                            return (
                                date.getMonth() === moisPasse &&
                                date.getFullYear() === anneePasse
                            )
                        })
                        .reduce((acc, item) => acc + Number(item.depense || 0), 0)

                    setDepensesMoisActuel(totalActuel)
                    setDepensesMoisPasse(totalPasse)
                } else {
                    setDepensesMoisActuel(0)
                    setDepensesMoisPasse(0)
                }
            })
            return () => Ecoute()
        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors de la récupération des dépenses")
        }
    }, [])

    // Comparaison avec le mois passé
    const diff = depensesMoisPasse > 0
        ? Math.round(((depensesMoisActuel - depensesMoisPasse) / depensesMoisPasse) * 100)
        : null

    const diffLabel = diff === null
        ? "Aucune donnée le mois passé"
        : diff > 0
            ? `+${diff}% de plus que ${MOIS[moisPasse]}`
            : diff < 0
                ? `${diff}% de moins que ${MOIS[moisPasse]}`
                : `Identique à ${MOIS[moisPasse]}`

    const diffColor = diff === null
        ? "text-gray-400"
        : diff > 0
            ? "text-red-500"
            : "text-emerald-500"

    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 w-full max-w-xs shadow-sm">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-orange-300 opacity-60 pointer-events-none" />

            {/* Titre */}
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                Dépenses — {MOIS[moisActuel]}
            </span>

            {/* Montant */}
            <p className="font-mono text-2xl font-medium my-3 text-gray-900">
                {depensesMoisActuel.toLocaleString("fr-FR")}
                <span className="text-base font-normal text-gray-400"> F CFA</span>
            </p>
            
            <p className="font-mono stat-desc">Suivi des sorties d’argent pour le mois <br /> de <span className="font-semibold"> {MOIS[moisActuel]} </span></p>

            {/* Comparaison mois passé */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className={`text-xs ${diffColor}`}>
                     {diffLabel}
                </span>
            </div>
        </div>
    )
}

export default DepenseDuMois
import { useEffect, useState } from "react"
import { onValue, ref, set } from "firebase/database"
import { database } from "../firebase"
import { Toasterror } from "../Controllers/ToastEmmiter"
import { UseUserStore } from "../Stores"
import { getDepensesPath, getEpargneByMonthPath } from "../Utils/firebasePaths"

const BUDGET_MENSUEL = 500000

const EpargneDuMois = () => {
    const [depensesMoisActuel, setDepensesMoisActuel] = useState(0)
    const [epargneCumul, setEpargneCumul] = useState(0)
    const user = UseUserStore((state) => state.user)

    const now = new Date()
    const moisActuel = now.getMonth()
    const anneeActuelle = now.getFullYear()

    useEffect(() => {
        if (!user?.uid) return

        try {
            // 1 — Écoute les dépenses du mois actuel
            const depenseRef = ref(database, getDepensesPath(user.uid))
            const EcouteDepenses = onValue(depenseRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    const liste = Object.entries(data).map(([id, value]: any) => ({ id, ...value }))
                    const totalActuel = liste
                        .filter((item) => {
                            const date = new Date(item.createdAt)
                            return (
                                date.getMonth() === moisActuel &&
                                date.getFullYear() === anneeActuelle
                            )
                        })
                        .reduce((acc, item) => acc + Number(item.depense || 0), 0)

                    setDepensesMoisActuel(totalActuel)
                }
            })

            // 2 — Écoute l'épargne cumulative depuis Firebase
            const epargneRef = ref(database, `users/${user.uid}/epargne/${anneeActuelle}`)
            const EcouteEpargne = onValue(epargneRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    // Somme de tous les mois enregistrés
                    const cumul = Object.values(data).reduce(
                        (acc: number, val: any) => acc + Number(val || 0), 0
                    )
                    setEpargneCumul(cumul as number)
                }
            })

            return () => {
                EcouteDepenses()
                EcouteEpargne()
            }
        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors du calcul de l'épargne")
        }
    }, [user?.uid, anneeActuelle])

    // 3 — Sauvegarde l'épargne du mois actuel dans Firebase
    useEffect(() => {
        if (!user?.uid) return
        if (depensesMoisActuel === 0) return
        const resteduMois = BUDGET_MENSUEL - depensesMoisActuel
        if (resteduMois <= 0) return

        // On sauvegarde sous users/{userId}/epargne/2025/mois (ex: users/{userId}/epargne/2025/4 pour Mai)
        const epargneduMoisRef = ref(database, `users/${user.uid}/epargne/${anneeActuelle}/${moisActuel}`)
        set(epargneduMoisRef, resteduMois)
    }, [depensesMoisActuel, user?.uid, anneeActuelle, moisActuel])

    // Calculs affichage
    const resteduMois = BUDGET_MENSUEL - depensesMoisActuel
    const pourcentage = Math.round((resteduMois / BUDGET_MENSUEL) * 100)
    const danger = resteduMois < 0

    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm min-h-50 flex flex-col justify-between">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-orange-200 opacity-60 pointer-events-none" />

            {/* Titre */}
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                Épargne après dépenses
            </span>

            {/* Reste du mois */}
            <p className={`font-mono text-2xl font-medium my-3 ${danger ? "text-red-500" : "text-gray-900"}`}>
                {resteduMois.toLocaleString("fr-FR")}
                <span className="text-base font-normal text-gray-400"> F CFA</span>
            </p>

            {/* Pourcentage */}
            <div className="mb-3">
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${danger ? "bg-red-500" : "bg-neutral"}`} style={{ width: `${Math.max(0, pourcentage)}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    {pourcentage}% économisé sur {BUDGET_MENSUEL.toLocaleString("fr-FR")} F CFA
                </p>
            </div>

            {/* Épargne cumulative */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">
                    Cumul épargne {anneeActuelle}
                </span>
                <span className="text-xs font-medium text-blue-600">
                    {epargneCumul.toLocaleString("fr-FR")} F CFA
                </span>
            </div>
        </div>
    )
}

export default EpargneDuMois
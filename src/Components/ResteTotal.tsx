import { useEffect } from "react"
import { ResteStore } from "../Stores"
import { onValue, ref } from "firebase/database"
import { database } from "../firebase"
import { Toasterror } from "../Controllers/ToastEmmiter"

const BUDGET_MENSUEL = 500000

const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",]

const ResteTotal = () => {

    const budgets = ResteStore((state) => state.reste) //Le store des budgets
    const setBudgets = ResteStore((state) => state.resteTotal)//Le store de mise a jour des budgets

    //Date actuelle
    const now = new Date()
    const moisActuel = MOIS[now.getMonth()]
    const moisSuivant = MOIS[(now.getMonth() + 1) % 12]

    //RECUPERATION FIREBAS
    useEffect(() => {
        try {
            const budgetRef = ref(database, "budget") //Reference firebase
            const Ecoute = onValue(budgetRef, (snapshot) => { //Ecoute temps réel firebase
                const data = snapshot.val() //Données depuis firebase
                if (data) {
                    const changeObjet = Object.entries(data).map(([id, value]: any) => ({ //Transformation objet firebase -> tableau
                        id,
                        ...value
                    }))
                    setBudgets(changeObjet) //Mise a jour du store
                } else {
                    setBudgets([]) //Reset du store
                }
            })
            return () => Ecoute() //Nettoyage listener
        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors de la récupération des budgets")
        }

    }, [setBudgets])

    //CALCULS
    const totalDepense = budgets.reduce((acc, item) => {  //Total des dépenses
        return acc + Number(item.montant || 0)
    }, 0)
    const reste = BUDGET_MENSUEL - totalDepense  //Reste total
    const pourcentage = Math.min( //Pourcentage utilisé
        100,
        Math.round((totalDepense / BUDGET_MENSUEL) * 100)
    )
    const danger = reste < 0 //Etat danger
    const attention = !danger && pourcentage > 80 //Etat attention

    //COULEUR BARRE
    const barreColor = danger
        ? "bg-red-500"
        : attention
            ? "bg-neutral"
            : "bg-emerald-500"

    //COULEUR RESTE
    const resteColor = danger
        ? "text-red-500"
        : "text-gray-900"

    //BADGE
    const badge = danger
        ? {
            label: "Dépassé",
            cls: "bg-red-100 text-red-700"
        }
        : attention
            ? {
                label: "Attention",
                cls: "bg-orange-400 text-white"
            }
            : {
                label: "OK",
                cls: "bg-emerald-100 text-emerald-700"
            }

    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm min-h-[200px] flex flex-col justify-between">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-orange-400 opacity-60 pointer-events-none" />
            {/* Titre */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    Reste total
                </span>
            </div>
            {/* Montant restant */}
            <p className={`font-mono text-2xl font-medium mb-3 ${resteColor}`}>
                {reste.toLocaleString("fr-FR")}
                <span className="text-base font-normal text-gray-400">
                    {" "}F CFA
                </span>
            </p>
            {/* Barre progression */}
            <div className="mb-3">
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${barreColor}`}
                        style={{ width: `${pourcentage}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">
                        {pourcentage}% dépensé
                    </span>
                    <span className="text-xs text-gray-400">
                        sur {BUDGET_MENSUEL.toLocaleString("fr-FR")} F CFA
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">
                    {moisActuel} - {moisSuivant}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                    {badge.label}
                </span>
            </div>
        </div>
    )
}

export default ResteTotal

function BudgetTotalDuMois() {

    const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",]
    const now = new Date()  // ← manquant
    const moisActuel = MOIS[now.getMonth()]
    const moisSuivant = MOIS[(now.getMonth() + 1) % 12]

    return (
        <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm min-h-[200px] flex flex-col justify-between">
            <div className="">
                <p className='font-mono stat-title text-xs font-medium uppercase tracking-widest text-gray-500'>Budget du mois</p>
                <p className='font-mono text-2xl font-medium stat-value my-3'>500 000 <span className="text-base font-normal text-gray-400">F CFA</span></p>
                <p className='font-mono stat-desc'>Objectif financier mensuel actuellement <br /> disponible.</p>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-orange-500 opacity-60 pointer-events-none"></div>
            <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                <p className="text-gray-400">  Budget du mois du <span className="font-semibold"> {moisActuel} </span> au mois de <span className="font-semibold"> {moisSuivant} </span> </p>
            </div>

        </div>
    )
}

export default BudgetTotalDuMois

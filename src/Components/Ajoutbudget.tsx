import  { useState } from "react"
import React from "react"
import { BudgetStore, UseUserStore } from "../Stores"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"
import type { BudgetType } from "../Types"
import axios from "axios"

function Ajoutbudget() {

    const updateBudget = BudgetStore(state => state.updateBudget)
    const user = UseUserStore(state => state.user)

    const [tittre, setTitre] = useState("")
    const [montant, setMontant] = useState(0)
    const [load, setLoad] = useState(false)

    const SubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault()
            if (!user?.uid) return Toasterror("Utilisateur non connecté")
            setLoad(true)

            const serveur = import.meta.env.VITE_databaseURL

            const objet: BudgetType = {
                tittre,
                montant,
                depense: 0,
                reste: montant,
                idUser: user?.uid
            }

            const req = await axios.post(`${serveur}/budget.json`, objet)
            const data = req.data

            //On ajoute le budget au store
            updateBudget({...objet, id: data.name})
            
            setTitre("")
            setMontant(0)

            Toastsuccess("Budget ajouter avec succès...")

            //Pour fermer le modal
            document.getElementById("close")?.click()

        } catch (error) {
            console.log(error)
            Toasterror("Une erreur s est produite. Ressayez plus tard")
        } finally {
            setLoad(false)
        }
    }

    return (
        <div>
            <div className="modal" role="dialog" id="ajout-budget-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-3">Nouveau budget</h3>
                    <form className="flex flex-col gap-3" onSubmit={(e) => SubmitForm(e)}>
                        <input value={tittre} onChange={(e) => setTitre(e.target.value)} type="text" placeholder="Titre du budget" required className="input input-lg w-full" />
                        <input value={montant} onChange={(e) => setMontant(Number(e.target.value))} type="number" placeholder="Montant" required className="input input-lg w-full" />
                        <button type="submit" aria-label="Ajoutez un budget" className="btn btn-neutral" disabled={load}>
                            {!load ? (
                                <span>Ajouter</span>
                            ) : <span>En cours...</span>}
                        </button>
                    </form>
                    <div className="modal-action">
                        <a id="close" aria-label="Fermerture" href="#" className="btn">Fermer !</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ajoutbudget

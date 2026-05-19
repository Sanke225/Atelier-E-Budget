import { useState, useEffect } from "react"
import { BudgetStore } from "../Stores"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"
import type { BudgetType } from "../Types"
import axios from "axios"



function EditButton({ budget }: { budget: BudgetType | null }) { //Il reçoit BUDGET en props
  const updateBudgetItem = BudgetStore(state => state.updateBudgetItem) // J'appelle depuis mon store, pour modifier mes state dans la globalité
  const [tittre, setTittre] = useState(budget?.tittre || "") //Si budget existe, Use titre sinon Rien
  const [montant, setMontant] = useState(budget?.montant || 0) // Si bugget existe, Use montant sinon Rien
  const [load, setLoad] = useState(false) // Mes chargements, en cour true, pas de chargement false

  // Mon EFFECT declenche chaque fois que budget change
  useEffect(() => {
    setTittre(budget?.tittre || "")
    setMontant(budget?.montant || 0)
  }, [budget])


  const editbudget = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setLoad(true)

      // J'use l'URL du serveur depuis mon .ENV
      const serveur = import.meta.env.VITE_databaseURL

      // Création du nouvel objet budget modifié
      const updatedBudget: BudgetType = {
        ...budget!,
        tittre,
        montant,
        reste: montant - (budget?.depense || 0)
      }

      // J'envoie les nouveaux données a ma DB.
      await axios.patch(`${serveur}/budget/${budget?.id}.json`, updatedBudget)
      updateBudgetItem(updatedBudget) // Mets a jour les states globale depuis Zustand
      Toastsuccess("Budget modifié avec succès")
       //Fermerture du modal
    } catch (error) {
      console.log(error)
      Toasterror("Erreur lors de la modification")
    } finally {
      setLoad(false)
    }
  }

  return (
    <dialog className="modal" role="dialog" id={`edit-budget-modal-${budget?.id}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-3">Modifier le budget</h3>
        <form className="flex flex-col gap-3" onSubmit={editbudget}>
          <input value={tittre} onChange={(e) => setTittre(e.target.value)} type="text" placeholder="Titre du budget" required className="input input-lg w-full" />
          <input value={montant} onChange={(e) => setMontant(Number(e.target.value))} type="number" placeholder="Montant" required className="input input-lg w-full" />
          <button type="submit" className="btn btn-neutral" disabled={load}>
            {!load ? <span>Modifier</span> : <span>En cours...</span>}
          </button>
        </form>
        <div className="modal-action">
          <form method="dialog">
            <button type="submit" className="btn">
              Fermer !
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default EditButton
import { useState, useEffect } from "react"
import { BudgetStore, UseUserStore } from "../Stores"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"
import type { BudgetType } from "../Types"
import axios from "axios"
import { getBudgetByIdPath } from "../Utils/firebasePaths"

type EditButtonProps = {
  budget: BudgetType | null
  isOpen?: boolean
  onClose?: () => void
}

function EditButton({ budget, isOpen = false, onClose }: EditButtonProps) { //Il reçoit BUDGET en props
  const updateBudgetItem = BudgetStore(state => state.updateBudgetItem) // J'appelle depuis mon store, pour modifier mes state dans la globalité
  const user = UseUserStore((state) => state.user)
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
      if (!user?.uid || !budget?.id) return Toasterror("Données manquantes")
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
      await axios.patch(`${serveur}/${getBudgetByIdPath(user.uid, budget.id)}.json`, updatedBudget)
      updateBudgetItem(updatedBudget) // Mets a jour les states globale depuis Zustand
      Toastsuccess("Budget modifié avec succès")

      // Fermerture du modal
      if (onClose) onClose()
    } catch (error) {
      console.log(error)
      Toasterror("Erreur lors de la modification")
    } finally {
      setLoad(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
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
          <button type="button" onClick={onClose} className="btn">
            Fermer !
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

export default EditButton
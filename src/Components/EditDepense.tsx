import { useState, useEffect } from "react"
import { DepenseStore } from "../Stores"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"
import type { DepenseType } from "../Types"
import axios from "axios"

type EditDepenseProps = {
  depense: DepenseType | null
  isOpen?: boolean
  onClose?: () => void
}

function EditDepense({ depense, isOpen = false, onClose }: EditDepenseProps) {
  const [titre, setTitre] = useState(depense?.titre || "")
  const [montant, setMontant] = useState(depense?.depense || 0)
  const [load, setLoad] = useState(false)

  // Mettre à jour les valeurs quand la dépense change
  useEffect(() => {
    setTitre(depense?.titre || "")
    setMontant(depense?.depense || 0)
  }, [depense])

  const editDepense = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setLoad(true)

      const serveur = import.meta.env.VITE_databaseURL

      // Création de l'objet dépense modifié
      const updatedDepense: DepenseType = {
        ...depense!,
        titre,
        depense: montant
      }

      // Mise à jour dans Firebase
      await axios.patch(`${serveur}/depenses/${depense?.id}.json`, updatedDepense)

      // Mise à jour du store local (optionnel selon ton store)
      Toastsuccess("Dépense modifiée avec succès")

      // Fermeture du modal
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
        <h3 className="text-lg font-bold mb-3">Modifier la dépense</h3>
        <form className="flex flex-col gap-3" onSubmit={editDepense}>
          <input
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            type="text"
            placeholder="Titre de la dépense"
            required
            className="input input-lg w-full"
          />
          <input
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
            type="number"
            placeholder="Montant"
            required
            className="input input-lg w-full"
          />

          {/* Catégorie en lecture seule */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-600">Catégorie</p>
            <p className="font-semibold text-lg">{depense?.categorie || "-"}</p>
          </div>

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

export default EditDepense

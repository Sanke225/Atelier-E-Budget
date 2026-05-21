import { useState, useEffect } from "react"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"
import axios from "axios"
import type { DepenseType } from "../Types"
import { UseUserStore, BudgetStore } from "../Stores"
import { getDepensesPath } from "../Utils/firebasePaths"

type AjoutDepensesProps = {
    isOpen?: boolean
    onClose?: () => void
    categoriePredefinie?: string
}

function AjoutDepenses({ isOpen = false, onClose, categoriePredefinie = "" }: AjoutDepensesProps) {

    const [titre, setTitre] = useState("")
    const [montant, setMontant] = useState<number>(0)
    const [load, setLoad] = useState(false)

    // La catégorie est déterminée par categoriePredefinie ou peut être saisie manuellement
    const [categorie, setCategorie] = useState("")

    const { user } = UseUserStore()
    const budget = BudgetStore(state => state.budget)

    // Mettre à jour la catégorie quand categoriePredefinie change
    useEffect(() => {
        if (categoriePredefinie) {
            setCategorie(categoriePredefinie)
        }
    }, [categoriePredefinie])

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            //Vérifie sur l'user est connecté
            if (!user?.uid) {
                return Toasterror("Utilisateur non connecté")
            }

            setLoad(true)

            const serveur = import.meta.env.VITE_databaseURL

            //L'objet depenses a envoyé
            const objet: DepenseType = {
                idUser: user.uid,
                categorie: categoriePredefinie || categorie,
                titre,
                depense: montant,
                createdAt: Date.now()
            }

            //Envoie a la DB avec le chemin utilisateur
            const userPath = getDepensesPath(user.uid)
            await axios.post(`${serveur}/${userPath}.json`, objet)

            

            setTitre("")
            setMontant(0)
            setCategorie("")

            Toastsuccess("Dépense ajoutée avec succès")

            //Fermerture du modal
            if (onClose) onClose()

        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors de l'ajout")
        } finally {
            setLoad(false)
        }

    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg font-bold mb-3">Nouvelle dépense</h3>
                <form className="flex flex-col gap-3" onSubmit={submitForm}>
                    {/* 1. Titre */}
                    <input
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        type="text"
                        placeholder="Titre de la dépense"
                        required
                        className="input input-lg w-full"
                    />

                    {/* 2. Montant */}
                    <input
                        value={montant}
                        onChange={(e) => setMontant(Number(e.target.value))}
                        type="number"
                        placeholder="Montant"
                        required
                        className="input input-lg w-full"
                    />

                    {/* 3. Catégorie - Si prédéfinie, afficher en lecture seule, sinon liste déroulante */}
                    {categoriePredefinie ? (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Catégorie</p>
                            <p className="font-semibold text-lg">{categoriePredefinie}</p>
                        </div>
                    ) : (
                        <select
                            value={categorie}
                            onChange={(e) => setCategorie(e.target.value)}
                            required
                            className="select select-lg w-full border-gray-300"
                        >
                            <option value="" disabled>Sélectionnez une catégorie</option>
                            {budget && budget.length > 0 ? (
                                budget.map((item) => (
                                    <option key={item.id} value={item.tittre}>
                                        {item.tittre}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Aucun budget disponible</option>
                            )}
                        </select>
                    )}

                    <button type="submit" className="btn btn-neutral" disabled={load}>
                        {!load ? (
                            <span>Ajouter</span>
                        ) : <span>En cours...</span>}
                    </button>
                </form>
                <div className="modal-action">
                    <button type="button" onClick={onClose} className="btn">Fermer !</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    )
}

export default AjoutDepenses

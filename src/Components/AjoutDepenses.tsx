import { useState } from "react"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"
import axios from "axios"
import type { DepenseType } from "../Types"
import { DepenseStore, UseUserStore } from "../Stores"

function AjoutDepenses() {

    const [titre, setTitre] = useState("")
    const [montant, setMontant] = useState<number>(0)
    const [categorie, setCategorie] = useState("")
    const [load, setLoad] = useState(false)

    const updateDepense = DepenseStore((state) => state.updateDepense)
    const { user } = UseUserStore()

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
                categorie,
                titre,
                depense: montant,
                createdAt: Date.now()
            }

            //Envoie a la DB
            await axios.post(`${serveur}/depenses.json`, objet)

            setTitre("")
            setMontant(0)
            setCategorie("")

            Toastsuccess("Dépense ajouté avec succes")

            //Fermerture du modal
            document.getElementById("close")?.click()

        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors de l'ajout")
        } finally {
            setLoad(false)
        }

    }

    return (
        <div>
            <div className="modal" role="dialog" id="ajout-depense-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold mb-3">Nouvelle dépense</h3>
                    <form className="flex flex-col gap-3" onSubmit={submitForm}>
                        <input value={titre} onChange={(e) => setTitre(e.target.value)} type="text" placeholder="Titre du dépense" required className="input input-lg w-full" />
                        <input value={montant} onChange={(e) => setMontant(Number(e.target.value))} type="number" placeholder="Montant" required className="input input-lg w-full" />
                        <input value={categorie} onChange={(e) => setCategorie(e.target.value)} type="text" placeholder="Catégorie du dépense" required className="input input-lg w-full" />
                        <button type="submit" className="btn btn-neutral" disabled={load}>
                            {!load ? (
                                <span>Ajouter</span>
                            ) : <span>En cours...</span>}
                        </button>
                    </form>
                    <div className="modal-action">
                        <a id="close" href="#" className="btn">Fermer !</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AjoutDepenses

import { Link } from "react-router-dom"
import GmailConnection from "../Components/GmailConnection"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import { auth } from "../firebase"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"

function Signup() {

    const [nom, setNom] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPasword] = useState("")



    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {

        try {
            e.preventDefault()

            //Je crée l'user dans firebase avec email /mdp
            const data = await createUserWithEmailAndPassword(auth, email, password)

            //Je sauvegarde le nom de l'user dans firebase auth
            await updateProfile(data.user, { displayName: nom })

            //J'envoie un email pour valider le compte
            await sendEmailVerification(data.user)

            Toastsuccess("Compte créer avec succès, Un email vous a été envoyé pour valider le compte")

        } catch (error: unknown) {

            const firebaseError = error as { code?: string }
            //Les liens de retour a la console
            const message = {
                "auth/email-already-in-use": "Cet email est déjà utilisé",
                "auth/invalid-email": "Email invalide",
                "auth/weak-password": "Mot de passe trop faible",
                "auth/operation-not-allowed": "Inscription désactivée",
            }[firebaseError.code ?? ""] || "Une erreur est survenue"

            Toasterror(message)
        }
    }

    return (
        <div>
            <div
                className="hero min-h-screen hero-bg"
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center border-8 border-neutral-950 lg:p-20 bg-yellow-400/80 shadow-2xl">
                    <div className="max-w-md">

                        <GmailConnection />

                        <p>- ou -</p>

                        <form onSubmit={submitForm} className='flex flex-col gap-5'>
                            <h2 className='text-2xl text-white font-bold mb-5'>Créer un compte</h2>
                            <input onChange={(e) => setNom(e.target.value)} type="text" placeholder='Nom complet' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='E-mail' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <input onChange={(e) => setPasword(e.target.value)} type="password" placeholder='Mot de passe' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <button type="submit" className='btn btn-neutral'>S'inscrire</button>
                        </form>
                        <div className='mt-5'>
                            <p>déja membre membre ? <Link to="/" className="underline">Se connecter</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup

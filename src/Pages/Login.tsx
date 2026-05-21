import { Link } from "react-router-dom"
import GmailConnection from "../Components/GmailConnection"
import { useState } from "react"
import { sendEmailVerification, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "firebase/auth"
import { auth } from "../firebase"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showResendButton, setShowResendButton] = useState(false)


    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        try {

            // Configurer la persistance locale
            await setPersistence(auth, browserLocalPersistence)

            //Je connete l'user via firebase
            const data = await signInWithEmailAndPassword(auth, email, password)
            const user = data.user

            //Je verifie si l'email a été validé
            if (!user.emailVerified) {

                //J'envoie un email pour valider le compte user
                await sendEmailVerification(data.user)
                Toasterror("Compte non vérifié. Un email de vérification a été envoyé. Vérifiez vos spams.")

                //Je deconnecte l'user
                await signOut(auth)

                // Afficher le bouton pour renvoyer l'email
                setShowResendButton(true)
                return;
            }

            Toastsuccess("Connexion reussi...")

        } catch (error: unknown) {
            const firebaseError = error as { code?: string }

            //Les liens de retour a la console
            const message = {
                "auth/invalid-credential": "Email ou mot de passe incorrect",
                "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
                "auth/user-not-found": "Utilisateur introuvable",
                "auth/wrong-password": "Mot de passe incorrect",
            }[firebaseError.code ?? ""] || "Une erreur est survenue"

            Toasterror(message)
        }
    }

    // Fonction pour renvoyer l'email de vérification
    const resendVerificationEmail = async () => {
        try {
            if (!email || !password) {
                Toasterror("Veuillez entrer votre email et mot de passe")
                return
            }

            // Configurer la persistance locale
            await setPersistence(auth, browserLocalPersistence)

            // Se connecter temporairement
            const data = await signInWithEmailAndPassword(auth, email, password)

            // Renvoyer l'email
            await sendEmailVerification(data.user)
            Toastsuccess("Email de vérification renvoyé ! Vérifiez votre boîte mail et vos spams.")

            // Se déconnecter
            await signOut(auth)
        } catch (error) {
            console.error(error)
            Toasterror("Erreur lors de l'envoi de l'email")
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
                            <h2 className='text-2xl text-white font-bold mb-3'>Se connecter</h2>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='E-mail' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Mot de passe' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <button type="submit" className='btn btn-neutral'>Se connecter</button>

                            {/* Bouton pour renvoyer l'email de vérification */}
                            {showResendButton && (
                                <button
                                    type="button"
                                    onClick={resendVerificationEmail}
                                    className='btn btn-outline btn-sm'
                                >
                                    Renvoyer l'email de vérification
                                </button>
                            )}
                        </form>
                        <div className='mt-5'>
                            <p>Pas encore membre ? <Link to="/signup" className="underline">Créer un compte</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

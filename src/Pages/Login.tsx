import { Link, useNavigate } from "react-router-dom"
import GmailConnection from "../Components/GmailConnection"
import { useState, useEffect } from "react"
import { sendEmailVerification, signInWithEmailAndPassword, signOut, getRedirectResult } from "firebase/auth"
import { auth } from "../firebase"
import { Toasterror, Toastsuccess } from "../Controllers/ToastEmmiter"
import { UseUserStore } from "../Stores"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const updateUser = UseUserStore(state => state.updateUser)

    // Gérer le résultat du redirect Google (pour mobile)
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth)
                if (result?.user) {
                    Toastsuccess("Vous avez été connecté via votre compte gmail...")

                    // Mettre à jour le store
                    updateUser({
                        uid: result.user.uid,
                        nom: result.user.displayName || "Utilisateur",
                        email: result.user.email || undefined,
                        tel: result.user.phoneNumber || undefined,
                        photoURL: result.user.photoURL || undefined
                    })

                    // Rediriger vers le dashboard
                    navigate("/dashboard")
                }
            } catch (error) {
                console.error("Erreur redirect:", error)
                Toasterror("Erreur lors de la connexion avec Google")
            }
        }

        handleRedirectResult()
    }, [])


    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        try {


            //Je connete l'user via firebase
            const data = await signInWithEmailAndPassword(auth, email, password)
            const user = data.user

            //Je verifie si l'email a été validé
            if (!user.emailVerified) {

                //J'envoie un email pour valider le compte user
                await sendEmailVerification(data.user)
                Toasterror("Compte non verifié. Un email vous a été envoyé pour valider votre compte.")

                //Je deconnecte l'user
                await signOut(auth)
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
                            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='E-mail' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Mot de passe' required className='input input-lg w-full placeholder:text-gray-400 focus:text-black' />
                            <button type="submit" className='btn btn-neutral'>Se connecter</button>
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

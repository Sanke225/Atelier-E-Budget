import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { Toasterror, Toastsuccess } from '../Controllers/ToastEmmiter'
import { auth } from '../firebase'
import { UseUserStore } from '../Stores'
import { useNavigate } from 'react-router-dom'

function GmailConnection() {

    const updateUser = UseUserStore(state => state.updateUser)
    const navigate = useNavigate()

    const Googleauth = async () => {
        try {
            // Configurer la persistance locale
            await setPersistence(auth, browserLocalPersistence)

            const provider = new GoogleAuthProvider()

            // Utiliser uniquement popup (fonctionne sur mobile moderne)
            const data = await signInWithPopup(auth, provider)

            if (data?.user) {
                Toastsuccess("Vous avez été connecté via votre compte gmail...")

                //On ajoute l'utilisateur dans le store
                updateUser({
                    uid: data.user.uid,
                    nom: data.user.displayName!,
                    email: data.user.email!,
                    photoURL: data.user.photoURL || undefined
                })

                //On redirige vers le backoffice
                navigate("/dashboard")

                console.log("Google user data:", data.user)
            } else {
                Toasterror("Une erreur a été commise...")
            }

        } catch (error: any) {
            console.log(error)

            // Message spécifique pour popup bloqué
            if (error.code === 'auth/popup-blocked') {
                Toasterror("Popup bloqué ! Veuillez autoriser les popups pour ce site.")
            } else if (error.code === 'auth/popup-closed-by-user') {
                Toasterror("Connexion annulée")
            } else {
                Toasterror("Erreur lors de la connexion avec Google")
            }
        }
    }

    return (
        <div className='mb-3'>
            <button type='button' onClick={Googleauth} className="btn btn-base w-full bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    )
}

export default GmailConnection

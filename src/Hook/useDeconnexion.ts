import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { UseUserStore } from "../Stores"
import { Toastsuccess, Toasterror } from "../Controllers/ToastEmmiter"

const useDeconnexion = () => {
    const navigate = useNavigate()
    const updateUser = UseUserStore(state => state.updateUser)

    const deconnexion = async () => {
        try {
            await signOut(auth)                          // Déconnexion Firebase
            updateUser(null as any)           // Reset du store user
            Toastsuccess("Déconnexion réussie")
            navigate("/")                       // Redirection
        } catch (error) {
            console.log(error)
            Toasterror("Erreur lors de la déconnexion")
        }
    }

    return { deconnexion }
}

export default useDeconnexion
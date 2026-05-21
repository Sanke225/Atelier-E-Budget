import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import "./style.css"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import Error404 from "./Pages/Error404"
import { Bounce, ToastContainer } from "react-toastify"
import AuthProvider from "./Components/AuthProvider"
import Dashboard from "./Pages/Dashboard"
import Depenses from "./Pages/Depenses"
import Navbar from "./Components/Navbar"
import Profil from "./Pages/Profil"
import { UseUserStore } from "./Stores"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

// Composant séparé car useLocation ne fonctionne qu'à l'intérieur de BrowserRouter
const AppContent = () => {
  const location = useLocation()
  const user = UseUserStore(state => state.user)
  const updateUser = UseUserStore(state => state.updateUser)

  // État pour gérer l'ouverture du sidebar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Synchroniser Firebase Auth avec le store Zustand
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user photoURL:", firebaseUser.photoURL)
        // Mettre à jour le store avec les données de Firebase Auth
        updateUser({
          uid: firebaseUser.uid,
          nom: firebaseUser.displayName || "Utilisateur",
          email: firebaseUser.email || undefined,
          tel: firebaseUser.phoneNumber || undefined,
          photoURL: firebaseUser.photoURL || undefined
        })
      }
    })

    return () => unsubscribe()
  }, [updateUser])

  // Pages où la Navbar ne doit PAS s'afficher
  const pagesPubliques = ["/", "/signup"]
  const afficherNavbar = !pagesPubliques.includes(location.pathname) && !!user?.uid

  return (
    <>
      {afficherNavbar && (
        <div className="sticky top-0 z-50">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <AuthProvider pageAutorise={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        } />

        <Route path="/budget" element={
          <AuthProvider pageAutorise={<Depenses sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        } />

        <Route path="/profil" element={
          <AuthProvider pageAutorise={<Profil sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
        } />


        <Route path="*" element={
          <AuthProvider pageAutorise={<Error404 />} />
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
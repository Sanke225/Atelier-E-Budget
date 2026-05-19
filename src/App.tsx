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

// Composant séparé car useLocation ne fonctionne qu'à l'intérieur de BrowserRouter
const AppContent = () => {
  const location = useLocation()
  const user = UseUserStore(state => state.user)

  // Pages où la Navbar ne doit PAS s'afficher
  const pagesPubliques = ["/", "/signup"]
  const afficherNavbar = !pagesPubliques.includes(location.pathname) && !!user?.uid

  return (
    <>
      {afficherNavbar && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <AuthProvider pageAutorise={<Dashboard />} />
        } />

        <Route path="/budget" element={
          <AuthProvider pageAutorise={<Depenses />} />
        } />

        <Route path="/profil" element={
          <AuthProvider pageAutorise={<Profil />} />
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
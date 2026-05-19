// src/Pages/Error404.tsx
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function Error404() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center px-6">
                <p className="font-mono text-8xl font-medium text-gray-200 leading-none">
                    404
                </p>
                <div className="w-10 h-px bg-gray-200 mx-auto my-6" />
                <p className="text-lg font-medium text-gray-800 mb-2"> Page introuvable </p>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed"> La page que vous cherchez n'existe pas <br /> ou a été déplacée. </p>
                <button type="button" onClick={() => navigate("/dashboard")} aria-label="Retour au tableau de bord" title="Retour au tableau de bord" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <ArrowLeft size={16} /> Retour au tableau de bord
                </button>

            </div>
        </div>
    )
}

export default Error404
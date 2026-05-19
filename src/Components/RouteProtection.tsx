// src/Components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom"
import { UseUserStore } from "../Stores"

const RouteProtection = ({ children }: { children: React.ReactNode }) => {
    const user = UseUserStore(state => state.user)

    if (!user || !user.uid) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default RouteProtection
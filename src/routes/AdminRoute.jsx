import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminRoute() {
    const { user, isAdmin, loading } = useAuth()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
    }

    if (!user || !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

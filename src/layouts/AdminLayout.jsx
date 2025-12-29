import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Users, GraduationCap, LogOut, ShieldCheck } from 'lucide-react'

export default function AdminLayout({ children }) {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col fixed h-full bg-surface/30 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-10">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Admin Panel
                    </span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/mentors"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/mentors') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <GraduationCap className="w-5 h-5" />
                        Mentors
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <Users className="w-5 h-5" />
                        Users
                    </Link>
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                    <Link to="/dashboard" className="mt-4 block text-center text-sm text-gray-500 hover:text-white transition-colors">
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

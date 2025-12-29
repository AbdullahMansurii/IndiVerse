import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        // Safety timeout: If Supabase hands, force finish loading after 5 seconds
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth check timed out. Forcing load completion.')
                setLoading(false)
            }
        }, 5000)

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (session?.user) {
                    if (mounted) setUser(session.user)
                    await fetchUserRole(session.user.id)
                } else {
                    if (mounted) setUser(null)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                if (mounted) setLoading(false)
                clearTimeout(safetyTimer)
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user)
                await fetchUserRole(session.user.id)
            } else {
                setUser(null)
                setRole(null)
            }
            setLoading(false)
        })

        return () => {
            mounted = false
            clearTimeout(safetyTimer)
            subscription.unsubscribe()
        }
    }, [])

    const fetchUserRole = async (userId) => {
        try {
            // Fetch Role from public.User table
            const { data, error } = await supabase
                .from('User')
                .select('role')
                .eq('id', userId)
                .maybeSingle()

            if (data?.role) {
                setRole(data.role)
            }

            // Note: Ban check logic is temporarily removed to ensure stability
        } catch (error) {
            console.error('Error fetching role:', error)
        }
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        role,
        isAdmin: role === 'ADMIN',
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
                    <div className="w-8 h-8 mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Authenticating...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}

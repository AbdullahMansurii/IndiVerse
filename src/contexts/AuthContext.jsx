import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true;

        // 1. FAILSAFE TIMEOUT
        // If Supabase takes longer than 3 seconds, we force the app to load.
        const timer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Supabase auth check timed out. Forcing app load.");
                setLoading(false);
            }
        }, 3000);

        const getSession = async () => {
            try {
                // 2. Attempt to get session
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Session error:', error)
                }

                if (session?.user) {
                    if (mounted) setUser(session.user)
                    // Non-blocking role fetch
                    fetchRole(session.user.id)
                } else {
                    if (mounted) setUser(null)
                }
            } catch (err) {
                console.error('Unexpected auth error:', err)
            } finally {
                // 3. Clear loading state naturally
                if (mounted) setLoading(false)
            }
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                if (session?.user) {
                    setUser(session.user)
                    // Non-blocking role fetch - don't await this if it blocks UI
                    fetchRole(session.user.id)
                } else {
                    setUser(null)
                    setRole(null)
                }
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            clearTimeout(timer)
            subscription.unsubscribe()
        }
    }, [])

    const fetchRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('User') // Make sure this table is accessible to the authenticated user!
                .select('role')
                .eq('id', userId)
                .single()

            if (data) setRole(data.role)
            if (error) console.warn('Role fetch warning:', error)
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
                <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-gray-500 text-sm">Connecting...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

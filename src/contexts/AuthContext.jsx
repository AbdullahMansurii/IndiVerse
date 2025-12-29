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

        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error reading session:', error)
                    if (mounted) setLoading(false)
                    return
                }

                if (session?.user) {
                    if (mounted) setUser(session.user)
                    // Fetch role immediately but safely
                    await fetchRole(session.user.id)
                } else {
                    if (mounted) setUser(null)
                }
            } catch (err) {
                console.error('Unexpected auth error:', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                if (mounted) setUser(session.user)
                await fetchRole(session.user.id)
            } else {
                if (mounted) {
                    setUser(null)
                    setRole(null)
                }
            }
            // Ensure loading is set to false after any auth change interaction
            if (mounted) setLoading(false)
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const fetchRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('User')
                .select('role')
                .eq('id', userId)
                .single()

            if (!error && data) {
                setRole(data.role)
            } else {
                // If fetching role fails, we still allow the user to be 'logged in' but maybe without admin privileges
                // This prevents the white screen of death
                console.warn('Could not fetch user role:', error)
            }
        } catch (error) {
            console.error('Error in fetchRole:', error)
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
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                checkUserStatus(session.user.id, session.user)
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await checkUserStatus(session.user.id, session.user)
            } else {
                setUser(null)
                setRole(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const checkUserStatus = async (userId, sessionUser) => {
        try {
            // 1. Fetch Role
            const { data: userData, error: userError } = await supabase
                .from('User')
                .select('role')
                .eq('id', userId)
                .single()

            if (userData) setRole(userData.role)

            // 2. Fetch Ban Status (metadata from Profile)
            /* TEMPORARILY DISABLED FOR DEBUGGING
            const { data: profileData } = await supabase
                .from('Profile')
                .select('metadata')
                .eq('id', userId)
                .single()

            if (profileData?.metadata?.isBanned) {
                await supabase.auth.signOut()
                alert('Your account has been suspended. Please contact support.')
                setUser(null)
                setRole(null)
                return
            }
            */

            setUser(sessionUser)

        } catch (error) {
            console.error('Error fetching user status:', error)
        } finally {
            setLoading(false)
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
                <div className="flex items-center justify-center min-h-screen bg-black text-white">
                    Loading Authentication...
                </div>
            ) : children}
        </AuthContext.Provider>
    )
}

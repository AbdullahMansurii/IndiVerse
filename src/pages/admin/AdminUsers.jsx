import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../layouts/AdminLayout'
import { Search, Mail, MapPin } from 'lucide-react'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .select('*')
            // .order('created_at', { ascending: false }) // 'created_at' does not exist on Profile

            if (error) throw error
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const name = user.fullName || ''
        const country = user.targetCountry || user.currentCountry || ''
        const search = searchTerm.toLowerCase()

        return name.toLowerCase().includes(search) ||
            country.toLowerCase().includes(search)
    })

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Users Directory</h1>
                    <p className="text-gray-400 mt-2">Manage all registered aspirants and mentors.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-gray-400 font-medium">Name</th>
                                <th className="p-4 text-gray-400 font-medium">Role</th>
                                <th className="p-4 text-gray-400 font-medium">Country</th>
                                <th className="p-4 text-gray-400 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                                {user.fullName?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.isStudyingAbroad
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.isStudyingAbroad ? 'MENTOR' : 'ASPIRANT'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {user.isStudyingAbroad ? user.currentCountry : user.targetCountry || '-'}
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

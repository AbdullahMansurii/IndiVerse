import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { COUNTRY_GUIDES } from '../lib/countryData'
import { ArrowRight, Globe } from 'lucide-react'

export default function CountryGuides() {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Country Guides</h1>
                    <p className="text-gray-400">Explore comprehensive guides for your dream study destinations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COUNTRY_GUIDES.map((country, index) => (
                        <Link key={country.id} to={`/guides/${country.slug}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-primary/50 transition-all h-full flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={country.image}
                                        alt={country.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                                        <span className="text-4xl">{country.flag}</span>
                                        <h2 className="text-2xl font-bold text-white">{country.name}</h2>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-gray-400 mb-6 flex-1">
                                        {country.brief}
                                    </p>

                                    <div className="flex items-center text-primary font-bold group-hover:gap-2 transition-all">
                                        Explore Guide <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

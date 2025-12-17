import { Link } from 'react-router-dom'
import Hero from '../components/landing/Hero'
import SocialProof from '../components/landing/SocialProof'
import HowItWorks from '../components/landing/HowItWorks'
import ComparisonTable from '../components/landing/ComparisonTable'
import FeaturedMentors from '../components/landing/FeaturedMentors'
import Testimonials from '../components/landing/Testimonials'
import FinalCTA from '../components/landing/FinalCTA'

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-black relative overflow-hidden text-white font-sans selection:bg-primary selection:text-white">

            {/* Header */}
            <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-white to-primary/50 bg-clip-text text-transparent">
                            Indiverse
                        </span>
                    </div>
                    <nav className="flex items-center space-x-6">
                        <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-white text-black px-6 text-sm font-bold hover:bg-gray-200 transition-all"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 relative z-10 w-full">
                <Hero />
                <SocialProof />
                <HowItWorks />
                <FeaturedMentors />
                <ComparisonTable />
                <Testimonials />
                <FinalCTA />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#050505] py-12 relative z-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white text-xs">IV</div>
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Indiverse.
                        </p>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-400">
                        <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}


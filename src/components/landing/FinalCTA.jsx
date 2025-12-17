import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
    return (
        <section className="py-32 relative text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to start your journey?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Don't let doubt hold you back. Connect with someone who has been there, done that.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/signup" className="group relative overflow-hidden rounded-xl bg-white text-black hover:bg-gray-200 transition-all px-8 py-4 flex items-center justify-center gap-2">
                        <span className="font-bold text-lg">Get Started Now</span>
                        <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

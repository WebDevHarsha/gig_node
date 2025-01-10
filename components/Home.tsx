import Link from 'next/link'
import { ArrowRight, Search, Briefcase, Wallet } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Gig Node</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              The decentralized marketplace for web3 freelancers and clients. Connect, collaborate, and create the future.
            </p>
            <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md text-blue-900"
              />
              <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-400">
              Start your journey in the world of web3 freelancing. No credit card required.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Gig Node?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-100 p-6 rounded-lg">
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Work Easily</h3>
              <p className="text-blue-600">
                Browse through a wide range of web3 projects and find the perfect gig that matches your skills.
              </p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
              <p className="text-blue-600">
                Easily post your project requirements and connect with talented freelancers from around the world.
              </p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <Wallet className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-blue-600">
                Utilize blockchain technology for secure and transparent transactions between clients and freelancers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Gig Node today and become part of the future of work in the web3 ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/find-work" className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-100">
              Find Work
            </Link>
            <Link href="/post-job" className="px-8 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 bg-blue-800 text-blue-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2023 Gig Node. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


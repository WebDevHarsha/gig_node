import Link from 'next/link'
import { ArrowLeft, CheckCircle, Globe, Shield, Zap } from 'lucide-react'
import { Navbar } from '../../components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar></Navbar>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">About Gig Node</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Introduction Section */}
          <section className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Gig Node is a decentralized marketplace connecting talented Web3 freelancers with innovative projects and clients. Our mission is to empower the global workforce in the rapidly evolving blockchain and cryptocurrency space.
              </p>
              <p className="text-gray-600">
                We believe in creating opportunities, fostering innovation, and building a community where skills meet groundbreaking ideas in the decentralized world.
              </p>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Globe className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Global Reach</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Connect with talented professionals and exciting projects from around the world.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Secure Transactions</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Blockchain-based escrow and smart contracts ensure safe and transparent payments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Skill Matching</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Advanced algorithms to match the right talent with the perfect project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <ol className="list-decimal list-inside space-y-4 text-gray-600">
                <li>Sign up as a client or freelancer</li>
                <li>Create a detailed profile showcasing your skills or project needs</li>
                <li>Browse and apply for jobs or post your project</li>
                <li>Collaborate through our secure platform</li>
                <li>Complete the work and receive payment through blockchain transactions</li>
              </ol>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Gig Node?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-1" />
                  <span className="ml-3 text-gray-600">Specialized in Web3 and blockchain technologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-1" />
                  <span className="ml-3 text-gray-600">Lower fees compared to traditional freelancing platforms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-1" />
                  <span className="ml-3 text-gray-600">Community-driven platform with a focus on innovation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-1" />
                  <span className="ml-3 text-gray-600">Continuous learning and networking opportunities</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-blue-600 shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-white mb-4">Join Gig Node today and become part of the future of work in the Web3 ecosystem.</p>
              <div className="flex justify-center space-x-4">
                <Link href="/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                  Sign Up
                </Link>
                <Link href="/post-job" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800">
                  Post a Job
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2023 Gig Node. All rights reserved.</p>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


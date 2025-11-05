"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Brain, Target, Rocket, Shield, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">UNI-Agent</span>
          </div>
          <Link href="/auth/select-account">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold">
              Launch App <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">7 AI Agents. Infinite Possibilities.</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Academic Assistant
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The world's first <span className="text-white font-semibold">multi-agent AI platform</span> that orchestrates 7 specialized agents to revolutionize how you learn, study, and succeed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/auth/select-account">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/50 transition-all hover:scale-105">
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Demo
              </Button>
            </Link>
            <a href="#video" className="scroll-smooth">
              <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm">
                Watch Demo Video
              </Button>
            </a>
          </div>

          {/* Demo Video */}
          <div id="video" className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 border border-white/10 backdrop-blur-sm bg-black/20 p-2">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
              <iframe
                src="https://drive.google.com/file/d/1YOpwcD_ipE0gLpUqF-pxEOzHl4DqsmVD/preview"
                className="w-full h-full"
                allow="autoplay"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Enterprise-Grade Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built with cutting-edge AI orchestration technology. Each feature is designed to give you superpowers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">7 Specialized AI Agents</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Not just one AI—seven expert agents working together: Planner, Course Tutor, Assignment Helper, Exam Prep, Notes Organizer, Research Assistant, and Campus Navigator.
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                <span>Multi-agent orchestration</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Agent Collaboration</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Watch agents work together in real-time. The Assignment Agent consults the Course Agent, who delegates to the Planner—all visible in our revolutionary workflow visualization.
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                <span>Live workflow tracking</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/20 group-hover:to-rose-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Multi-Modal Intelligence</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Upload screenshots of code errors, handwritten notes, math problems, or diagrams. Our AI analyzes images and provides expert guidance—like having a tutor look over your shoulder.
              </p>
              <div className="flex items-center text-pink-400 font-semibold">
                <span>Vision + Language AI</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Intelligent Spaced Repetition</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Auto-generate flashcards from your materials. Our AI schedules reviews using proven cognitive science—cards appear exactly when you need to review them for maximum retention.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold">
                <span>Science-backed learning</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/20 group-hover:to-green-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ethical AI Learning</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our agents guide learning, never solve assignments directly. Built-in academic integrity ensures you understand concepts deeply while staying within educational guidelines.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold">
                <span>Education-first approach</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/20 group-hover:to-amber-500/20 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Personalized Learning Paths</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Dual personas (CS major night owl vs Business major morning person) show how our AI adapts to your unique learning style, schedule preferences, and academic goals.
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                <span>Adaptive intelligence</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join the future of AI-powered education. No credit card required.
            </p>
            <Link href="/auth/select-account">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-7 text-xl font-bold rounded-xl shadow-2xl hover:scale-105 transition-all">
                <Rocket className="mr-2 h-6 w-6" />
                Launch App Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <span className="text-white font-semibold">UNI-Agent</span>
            </div>
            <p className="text-gray-400 text-sm">
              Powered by 7 specialized AI agents. Built for students, by innovators.
            </p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}

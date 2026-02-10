'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left side - Marketing/Branding */}
      <div className="relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen flex flex-col justify-between p-8 md:p-16 overflow-hidden">
        {/* Decorative Background - Simplified representation of the image background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] via-[#0E7490] to-[#0D9488]" />

        {/* Background Overlay Pattern/Image placeholder */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1576091160550-217359f51f8c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />

        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Aarogyam</span>
          </div>

          {/* Value Proposition */}
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Your Health History, <br />
              <span className="text-emerald-300">Securely Preserved.</span>
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 font-medium leading-relaxed max-w-lg">
              Manage prescriptions, track history, and access medical records with India's most trusted digital health locker.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm font-bold">
                <Lock className="w-4 h-4 text-emerald-300" />
                End-to-End Encrypted
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs font-bold text-cyan-200/60 tracking-wider">
            © {new Date().getFullYear()} Aarogyam. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[500px]">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

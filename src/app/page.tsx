import { AuthForm } from '@/components/auth/auth-form';
import { Branding } from '@/components/auth/branding';

export default function Home() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <Branding />
      <div className="flex items-center justify-center p-6 sm:p-12">
        <AuthForm />
      </div>
    </div>
  );
}

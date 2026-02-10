'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  HelpCircle,
  Loader2,
  User,
  Calendar,
  Upload,
  X,
  UserCircle,
  Building2,
  Info
} from 'lucide-react';

import { useAuth, useFirestore, useStorage } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper to convert ABHA/Mobile to dummy email for Firebase Auth
const toDummyEmail = (id: string) => `${id}@aarogyam.app`;

const abhaRegex = new RegExp(/^\d{14}$/);
const abhaError = 'ABHA Number must be 14 digits.';

const LoginSchema = z.object({
  abha: z.string().regex(abhaRegex, { message: abhaError }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const SignupSchema = z
  .object({
    userType: z.enum(['patient', 'hospital'], {
      required_error: 'Please select user type',
    }),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
    abha: z.string().regex(abhaRegex, { message: abhaError }),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const ForgotPasswordSchema = z.object({
  abha: z.string().regex(abhaRegex, { message: abhaError }),
});

type FormType = 'login' | 'signup' | 'forgotPassword';

export function AuthForm() {
  const [formType, setFormType] = useState<FormType>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const router = useRouter();

  const currentSchema =
    formType === 'login' ? LoginSchema :
      formType === 'signup' ? SignupSchema :
        ForgotPasswordSchema;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues:
      formType === 'login' ? { abha: '', password: '' } :
        formType === 'signup' ? { userType: 'patient', name: '', age: 0, abha: '', password: '', confirmPassword: '' } :
          { abha: '' },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Photo must be < 5MB' });
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const email = toDummyEmail(data.abha);

    try {
      if (formType === 'login') {
        await signInWithEmailAndPassword(auth, email, data.password);
        if (firestore) {
          const userSnap = await import('firebase/firestore').then(({ getDoc, doc }) => getDoc(doc(firestore, 'users', auth.currentUser!.uid)));
          const userData = userSnap.data();
          const path = userData?.userType === 'hospital' ? '/hospital-dashboard' : '/dashboard';
          toast({ title: 'Welcome back!', description: 'Login successful' });
          router.push(path);
        }
      } else if (formType === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, data.password);
        let photoURL = null;
        if (profilePhoto && storage) {
          const photoRef = ref(storage, `users/${userCred.user.uid}/profile.jpg`);
          await uploadBytes(photoRef, profilePhoto);
          photoURL = await getDownloadURL(photoRef);
        }

        await updateProfile(userCred.user, {
          displayName: data.name,
          photoURL: photoURL || undefined
        });

        if (firestore) {
          await setDoc(doc(firestore, 'users', userCred.user.uid), {
            userType: data.userType,
            name: data.name,
            age: data.age,
            abhaNumber: data.abha,
            photoURL: photoURL,
            email: email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        toast({ title: 'Account created', description: 'Welcome to Aarogyam' });
        router.push(data.userType === 'hospital' ? '/hospital-dashboard' : '/dashboard');
      } else if (formType === 'forgotPassword') {
        await sendPasswordResetEmail(auth, email);
        toast({ title: 'Reset email sent', description: 'Check your inbox' });
        setFormType('login');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Auth Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <Tabs defaultValue={formType === 'signup' ? 'signup' : 'login'} className="w-full">
          <TabsList className="w-full h-16 p-0 bg-slate-50/50 rounded-none border-b border-slate-100">
            <TabsTrigger
              value="login"
              onClick={() => setFormType('login')}
              className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-bold text-slate-500 transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              onClick={() => setFormType('signup')}
              className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-bold text-slate-500 transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {formType === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {formType === 'login'
                ? 'Please enter your details to access your dashboard.'
                : 'Join Aarogyam to start managing your health history.'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formType === 'signup' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* User Type */}
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-bold text-slate-700">Registration Type</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                          <Label htmlFor="type-patient" className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-white transition-all peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50">
                            <RadioGroupItem value="patient" id="type-patient" className="text-blue-600" />
                            <div className="flex items-center gap-2">
                              <UserCircle className="w-5 h-5 text-blue-600" />
                              <span className="font-bold text-sm">Patient</span>
                            </div>
                          </Label>
                          <Label htmlFor="type-hospital" className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-white transition-all peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50">
                            <RadioGroupItem value="hospital" id="type-hospital" className="text-blue-600" />
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              <span className="font-bold text-sm">Hospital</span>
                            </div>
                          </Label>
                        </RadioGroup>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">Full Name</FormLabel>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...field} placeholder="Dr. John Doe" className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">Age</FormLabel>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...field} type="number" placeholder="24" className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="abha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700">ABHA Number</FormLabel>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        {...field}
                        placeholder="XX-XXXX-XXXX-XXXX"
                        maxLength={14}
                        className="h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm font-medium tracking-widest"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center">
                          <Shield className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-0.5">
                      <FormLabel className="text-sm font-bold text-slate-700">Password</FormLabel>
                      <button
                        type="button"
                        onClick={() => setFormType('forgotPassword')}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formType === 'signup' && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <FormLabel className="text-sm font-bold text-slate-700">Confirm Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input {...field} type="password" placeholder="••••••••" className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] gap-2 border-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{formType === 'signup' ? 'Create Account' : 'Login to Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-4 py-1 text-[10px] font-black text-slate-300 bg-white uppercase tracking-[0.2em]">Secure Access</span>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-100 text-slate-500 font-bold text-sm gap-2 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4" />
              Need Help or Support?
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">
          {formType === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
            className="text-blue-600 font-bold hover:underline underline-offset-4"
          >
            {formType === 'login' ? 'Sign up now' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}

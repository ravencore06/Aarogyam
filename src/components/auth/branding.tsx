import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck } from 'lucide-react';

const brandingImage = PlaceHolderImages.find(
  (img) => img.id === 'branding-image'
);

export function Branding() {
  return (
    <div className="relative hidden h-screen flex-col justify-between bg-primary p-8 text-white md:flex">
      <div className="absolute inset-0">
        {brandingImage && (
          <Image
            src={brandingImage.imageUrl}
            alt={brandingImage.description}
            fill
            sizes="50vw"
            className="object-cover"
            priority
            data-ai-hint={brandingImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex items-center gap-2 text-2xl font-bold">
        <ShieldCheck className="h-8 w-8" />
        <span className="font-headline">MedPresecure</span>
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Your Health, Secured.
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Access your medical records with the highest level of security and
          privacy, powered by your Aadhaar identity.
        </p>
      </div>

      <div className="relative z-10 text-sm text-primary-foreground/60">
        &copy; {new Date().getFullYear()} MedPresecure. All rights reserved.
      </div>
    </div>
  );
}

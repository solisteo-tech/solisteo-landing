
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0E18] to-[#050810] text-white p-4">
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
          <h1
            className="text-9xl font-black bg-gradient-to-r from-[#254fff] to-[#1ad4ff] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            404
          </h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-white/60 max-w-md mx-auto text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#254fff] to-[#1ad4ff] text-white hover:opacity-90 border-0 h-12 px-8 text-lg font-semibold rounded-xl">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="h-12 px-8 text-lg border-white/10 text-white hover:bg-white/10 bg-white/5 rounded-xl backdrop-blur-sm">
              <HelpCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

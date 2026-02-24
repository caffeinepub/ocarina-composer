import { Heart } from 'lucide-react';

export function Footer() {
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'ocarina-composer'
  );
  
  return (
    <footer className="border-t border-border bg-card py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Ocarina Composer</p>
      </div>
    </footer>
  );
}

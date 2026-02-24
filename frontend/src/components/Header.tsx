import { Music } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Music className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ocarina Composer</h1>
            <p className="text-sm text-muted-foreground">4-Hole Pendant Ocarina Tablature</p>
          </div>
        </div>
      </div>
    </header>
  );
}

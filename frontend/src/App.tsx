import { MusicEditor } from './components/MusicEditor';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <MusicEditor />
      </main>
      <Footer />
    </div>
  );
}

export default App;

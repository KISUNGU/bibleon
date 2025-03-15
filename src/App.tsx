import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useBibleStore } from './store/bibleStore';
import Navigation from './components/Navigation';
import BibleViewer from './components/BibleViewer';
import Home from './components/Home';
import Notes from './components/Notes';
import Search from './components/Search';
import Menu from './components/Menu';
import Auth from './components/Auth';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';

const queryClient = new QueryClient();

function App() {
  const { currentReference } = useBibleStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'état initial de l'authentification
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col h-screen bg-gray-100">
          <main className="flex-1 overflow-auto pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
              <Route path="/book" element={<BibleViewer />} />
              <Route path="/search" element={<Search />} />
              <Route path="/notes" element={user ? <Notes verseId={`${currentReference.book}_${currentReference.chapter}_${currentReference.verse}`} /> : <Navigate to="/auth" />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/lexicon" element={<div>Lexique - À venir</div>} />
              <Route path="/dictionary" element={<div>Dictionnaire - À venir</div>} />
              <Route path="/highlight" element={<div>Surbrillance - À venir</div>} />
              <Route path="/downloads" element={<div>Téléchargements - À venir</div>} />
              <Route path="/faq" element={<div>FAQ - À venir</div>} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Launchpad from './pages/Launchpad';
import Admin from './pages/Admin';
import { useEffect, useState } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from './components/ui/Button';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-[#F7F7F5] font-sans text-[#1A1A1A]">
        <header className="bg-white border-b border-black/10 px-6 sm:px-10 py-6 flex items-center justify-between sticky top-0 z-10">
          <Link to="/" className="flex items-baseline gap-3 decoration-transparent">
            <h1 className="font-bold tracking-tighter uppercase text-2xl sm:text-3xl text-black">
              Miller Arcade Hub
            </h1>
            <span className="text-xs font-medium bg-black text-white px-2 py-0.5 rounded hidden sm:block">V2.0</span>
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                {user.email === 'mrenegar@gmail.com' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut(auth)}>Log Out</Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
              >
                Staff Login
              </Button>
            )}
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Launchpad />} />
            <Route path="/admin" element={<Admin user={user} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

import { useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useApplets, saveApplet, deleteApplet, AppletLink } from '../hooks/useApplets';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function Admin({ user }: { user: User | null }) {
  const { applets, loading } = useApplets();
  const [editingApplet, setEditingApplet] = useState<Partial<AppletLink> | null>(null);

  if (!user) {
    return (
      <div className="text-center py-20">
        <ShieldAlert className="w-16 h-16 mx-auto text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Staff Access Required</h2>
        <Button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign In with Google</Button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplet || !editingApplet.title || !editingApplet.url || !editingApplet.category) return;
    
    await saveApplet(editingApplet as any);
    setEditingApplet(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-black/5">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Admin Dashboard</h2>
          <p className="text-black/40 text-sm font-semibold uppercase tracking-widest mt-1">Manage Activities</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={async () => {
              const placeholderGames = [
                { title: 'Shuffleboard', category: 'game' as const, url: 'https://(paste-your-link-here)', description: 'One-button shuffleboard. Time your tap to slide the puck into the scoring zone.' },
                { title: 'Bowling', category: 'game' as const, url: 'https://(paste-your-link-here)', description: 'One-button bowling. Knock down the pins with a single tap.' },
                { title: 'Golf', category: 'game' as const, url: 'https://(paste-your-link-here)', description: 'One-button golf. Time your swing for a hole in one.' },
                { title: 'Curling', category: 'game' as const, url: 'https://(paste-your-link-here)', description: 'One-button curling. Slide the stone into the house.' }
              ];
              for (const g of placeholderGames) {
                await saveApplet(g);
              }
              alert('Added placeholders! Please click Edit on each to paste the real URLs.');
            }}
            variant="outline"
            className="gap-2"
          >
            Add JFM Games
          </Button>
          <Button 
            onClick={() => setEditingApplet({ category: 'game' })}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Applet
          </Button>
        </div>
      </div>

      {editingApplet && (
        <Card className="border-black/10 shadow-md">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>{editingApplet.id ? 'Edit Applet' : 'New Applet'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Title</label>
                  <Input 
                    required 
                    value={editingApplet.title || ''} 
                    onChange={e => setEditingApplet(prev => ({...prev!, title: e.target.value}))} 
                    placeholder="e.g. Balloon Pop"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select 
                    className="flex h-12 w-full bg-[#F0F0EE] px-4 py-2 rounded-full text-sm border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 text-black cursor-pointer"
                    value={editingApplet.category || 'game'}
                    onChange={e => setEditingApplet(prev => ({...prev!, category: e.target.value as 'game'|'utility'}))}
                  >
                    <option value="game">Game</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Applet URL</label>
                <Input 
                  required 
                  type="url"
                  value={editingApplet.url || ''} 
                  onChange={e => setEditingApplet(prev => ({...prev!, url: e.target.value}))} 
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Thumbnail URL (optional)</label>
                <Input 
                  type="url"
                  value={editingApplet.thumbnailUrl || ''} 
                  onChange={e => setEditingApplet(prev => ({...prev!, thumbnailUrl: e.target.value}))} 
                  placeholder="https://...png"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  className="flex w-full rounded-2xl bg-[#F0F0EE] px-4 py-3 text-sm border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 min-h-[100px] resize-y placeholder:text-black/40 text-black shadow-none"
                  value={editingApplet.description || ''} 
                  onChange={e => setEditingApplet(prev => ({...prev!, description: e.target.value}))} 
                  placeholder="A short description..."
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-3 bg-[#F0F0EE]/50 border-t border-black/5 rounded-b-[40px] p-6">
              <Button type="button" variant="ghost" onClick={() => setEditingApplet(null)}>Cancel</Button>
              <Button type="submit">Save Applet</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-center py-10 font-medium text-slate-500">Loading applets...</p>
      ) : (
        <div className="grid gap-4">
          {applets.map(applet => (
            <Card key={applet.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-black/5 shadow-sm">
              {applet.thumbnailUrl ? (
                <img src={applet.thumbnailUrl} className="w-24 h-24 object-cover rounded-2xl bg-[#F0F0EE]" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#E0E7FF] flex items-center justify-center text-4xl">
                  {applet.category === 'game' ? '🎮' : '🛠️'}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-xl text-black">{applet.title}</h4>
                <p className="text-xs text-black/40 font-bold uppercase mt-1 mb-2 tracking-widest">{applet.category}</p>
                <a href={applet.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-black hover:underline text-sm font-medium">
                  {applet.url}
                </a>
              </div>
              <div className="flex items-center gap-2 justify-center w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="outline" size="sm" onClick={() => setEditingApplet(applet)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm(`Remove ${applet.title}?`)) deleteApplet(applet.id);
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          {applets.length === 0 && !editingApplet && (
             <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
               <p className="text-slate-500 font-medium">No applets added yet.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

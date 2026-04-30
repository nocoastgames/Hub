import React, { useState } from 'react';
import { useApplets, AppletLink } from '../hooks/useApplets';
import { Card, CardContent, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Search, Gamepad2, Wrench, Play, Star, Hammer } from 'lucide-react';
import { motion } from 'motion/react';

export default function Launchpad() {
  const { applets, loading } = useApplets();
  const [search, setSearch] = useState('');

  const filteredApplets = applets.filter(applet => 
    applet.title.toLowerCase().includes(search.toLowerCase()) || 
    (applet.description && applet.description.toLowerCase().includes(search.toLowerCase()))
  );

  const devApplets = filteredApplets.filter(a => a.isDevelopment);
  const heroApplets = filteredApplets.filter(a => a.isHero && !a.isDevelopment);
  // We can either exclude hero applets from the normal list or keep them in both. 
  // Often it's better to exclude them from the normal list if they are displayed as heroes.
  const nonHeroes = filteredApplets.filter(a => !a.isHero && !a.isDevelopment);
  const games = nonHeroes.filter(a => a.category === 'game');
  const utilities = nonHeroes.filter(a => a.category === 'utility');

  return (
    <div className="space-y-12 pb-12">
      <motion.section 
        className="text-left space-y-6 py-8 px-0 sm:px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-left text-black">
          One-Button <span className="text-orange-600">Activities</span>
        </h2>
        <p className="text-lg text-black/60 max-w-2xl text-left">
          Explore games and useful tools built entirely for John F. Miller students.
        </p>
        
        <div className="max-w-xl relative pt-4 text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2  mt-2 text-black/40 w-5 h-5" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for activity..." 
            className="pl-12"
          />
        </div>
      </motion.section>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium text-lg">Loading...</div>
      ) : (
        <div className="space-y-12">
          {heroApplets.length > 0 && (
            <section className="space-y-6 px-4">
              <h3 className="text-2xl font-serif italic text-black font-bold opacity-80 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" /> Featured
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {heroApplets.map(applet => (
                  <HeroAppletCard key={applet.id} applet={applet} />
                ))}
              </div>
            </section>
          )}

          {games.length > 0 && (
             <AppletSection title="Cool Games" icon={<Gamepad2 className="w-8 h-8 text-orange-500" />} applets={games} />
          )}

          {utilities.length > 0 && (
             <AppletSection title="Helpful Tools" icon={<Wrench className="w-8 h-8 text-emerald-500" />} applets={utilities} />
          )}

          {devApplets.length > 0 && (
             <AppletSection title="In Development" icon={<Hammer className="w-8 h-8 text-indigo-500" />} applets={devApplets} />
          )}

          {!loading && filteredApplets.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl font-semibold">No applets found.</p>
              <p>Try searching for something else!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function AppletSection({ title, icon, applets }: { title: string, icon: React.ReactNode, applets: AppletLink[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-4">
        {icon}
        <h3 className="text-2xl font-serif italic text-black font-bold opacity-80">{title}</h3>
      </div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {applets.map(applet => (
          <motion.a 
            variants={itemVariants}
            key={applet.id} 
            href={applet.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group decoration-transparent"
          >
            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-black/5 flex flex-col group p-0">
              <div className="h-40 w-full bg-[#E0E7FF] relative overflow-hidden flex items-center justify-center">
                {applet.isDevelopment && (
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 shadow-md">
                    In Development
                  </div>
                )}
                {applet.thumbnailUrl ? (
                  <img src={applet.thumbnailUrl} alt={applet.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {applet.category === 'game' ? '🎮' : '🛠️'}
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex-1 flex flex-col items-start text-left">
                <CardTitle className="mb-2 text-[#1A1A1A] text-xl font-bold">{applet.title}</CardTitle>
                <p className="text-sm text-black/60 leading-relaxed mb-6 flex-1 line-clamp-3">
                  {applet.description || "No description provided."}
                </p>
                <div className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm group-hover:bg-black transition-colors text-center">
                  Launch Activity
                </div>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}

function HeroAppletCard({ applet }: { applet: AppletLink; key?: React.Key }) {
  return (
    <motion.a 
      variants={itemVariants}
      href={applet.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group decoration-transparent"
    >
      <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md border border-orange-500/20 flex flex-col md:flex-row group p-0 overflow-hidden bg-white">
        <div className="h-64 md:h-auto md:w-2/5 md:min-h-[300px] bg-[#E0E7FF] relative overflow-hidden flex items-center justify-center shrink-0">
          {applet.thumbnailUrl ? (
            <img src={applet.thumbnailUrl} alt={applet.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30">
              {applet.category === 'game' ? '🎮' : '🛠️'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">Featured</span>
          </div>
        </div>
        <CardContent className="p-8 flex-1 flex flex-col justify-center items-start text-left bg-gradient-to-br from-white to-orange-50/30">
          <CardTitle className="mb-4 text-[#1A1A1A] text-3xl font-black tracking-tight">{applet.title}</CardTitle>
          <p className="text-lg text-black/60 leading-relaxed mb-8 flex-1">
            {applet.description || "No description provided. Click to explore this featured activity!"}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-full font-bold uppercase tracking-widest shadow-lg group-hover:bg-black group-hover:scale-105 transition-all text-center justify-center">
            <Play className="w-5 h-5 fill-current" /> Play Now
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}

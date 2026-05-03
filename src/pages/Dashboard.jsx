import API_BASE from '../api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, ShieldCheck, Zap, Globe2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/elections`)
      .then(res => res.json())
      .then(data => {
        setElections(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader mt-20"></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="flex-col gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="glass-card text-center py-16 px-8 relative overflow-hidden" style={{ borderTop: '4px solid var(--saffron)' }}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <Globe2 size={64} className="mx-auto mb-6 text-[var(--accent-primary)] animate-pulse" />
        <h1 className="text-5xl md:text-6xl mb-6 gradient-text" style={{ lineHeight: '1.1' }}>
          Next-Gen Democratic Participation
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto mb-10" style={{ transform: 'translateZ(10px)' }}>
          Experience the future of voting with VoteSphere. Secure, transparent, and completely real-time. Your voice has never been this powerful.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn btn-primary text-lg px-8 py-4">Join the Network <ArrowRight size={20}/></Link>
          <Link to="/leaderboard" className="btn btn-outline text-lg px-8 py-4"><Activity size={20}/> Live Results</Link>
        </div>
      </motion.div>

      {/* Stats / Features Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card flex items-center gap-4">
          <ShieldCheck size={40} className="text-[var(--green)]" />
          <div>
            <h3 className="text-xl font-bold">Military-Grade</h3>
            <p className="text-sm text-muted">End-to-end simulated encryption.</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <Zap size={40} className="text-[var(--saffron)]" />
          <div>
            <h3 className="text-xl font-bold">Real-time Tally</h3>
            <p className="text-sm text-muted">Watch the leaderboard update instantly.</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <Users size={40} className="text-[var(--navy)]" />
          <div>
            <h3 className="text-xl font-bold">1M+ Voters</h3>
            <p className="text-sm text-muted">A rapidly growing global community.</p>
          </div>
        </div>
      </motion.div>

      {/* Live Elections Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold">Active Elections</h2>
            <p className="text-muted">Cast your vote before time runs out.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elections.map((election, index) => (
            <motion.div 
              key={election.id} 
              className="glass-card flex-col justify-between" 
              style={{ borderTop: `4px solid var(--${election.themeColor || 'accent-primary'})` }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`badge badge-${election.themeColor || 'navy'}`}>{election.country}</span>
                  <span className="flex items-center gap-2 text-muted text-sm bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                    <Clock size={14} className="text-[var(--saffron)]" /> {index === 0 ? 'Ends in 24h' : 'Ends in 7 days'}
                  </span>
                </div>
                <h2 className="text-2xl mb-3 leading-tight">{election.title}</h2>
                <p className="text-secondary mb-6 text-sm line-clamp-3">{election.description}</p>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-xs">
                      👤
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-xs text-white">
                    +
                  </div>
                </div>
                <Link 
                  to={`/election/${election.id}`} 
                  className="btn"
                  style={{ 
                    background: election.themeColor === 'green' ? '#16a34a' : election.themeColor === 'saffron' ? '#f97316' : '#1e3a8a',
                    color: 'white',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Vote Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Footer Section */}
      <motion.div variants={itemVariants} className="glass-card text-center py-12 mt-8 bg-[var(--bg-tertiary)]">
        <h2 className="text-3xl mb-4">Ready to Make a Difference?</h2>
        <p className="text-muted max-w-2xl mx-auto mb-8">Every vote counts. Ensure you are registered and your Aadhaar identity is verified before participating in national or state elections.</p>
        <Link to="/register" className="btn btn-primary px-8">Complete Registration</Link>
      </motion.div>
    </motion.div>
  );
}

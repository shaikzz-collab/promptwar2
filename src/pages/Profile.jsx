import API_BASE from '../api';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, ShieldCheck, Vote, Trophy, BarChart2, ArrowRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetch(`${API_BASE}/api/users/${user.id}/votes`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('votesphere_token')}` }
    })
      .then(res => res.json())
      .then(data => { setUserVotes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!user) return null;

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'VS';

  return (
    <motion.div className="flex-col gap-8" variants={stagger} initial="hidden" animate="show">

      {/* Hero Profile Banner */}
      <motion.div variants={item} className="glass-card text-center py-12 px-8 relative overflow-hidden" style={{ borderTop: '4px solid var(--saffron)' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'linear-gradient(135deg, var(--saffron), var(--navy), var(--green))' }}
        />
        {/* Avatar */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold text-white mx-auto mb-4 shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--saffron), var(--navy))' }}>
          {initials}
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-white text-[10px] flex items-center justify-center">✓</span>
        </div>
        <h1 className="text-4xl mb-1">{user.name}</h1>
        <p className="text-muted mb-2">{user.email}</p>
        <span className="inline-flex items-center gap-2 text-sm px-4 py-1 rounded-full font-semibold" style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--green)' }}>
          <ShieldCheck size={14} /> Verified Voter
        </span>
      </motion.div>

      {/* Info Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.12)' }}>
            <Mail size={24} color="var(--saffron)" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(30,58,138,0.12)' }}>
            <MapPin size={24} color="var(--navy)" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">State</p>
            <p className="font-semibold">{user.state || 'Not provided'}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(22,163,74,0.12)' }}>
            <Vote size={24} color="var(--green)" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Votes Cast</p>
            <p className="font-semibold">{loading ? '...' : userVotes.length} Election{userVotes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/" className="glass-card flex items-center justify-between group" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3">
              <Vote size={28} color="var(--saffron)" />
              <div>
                <p className="font-bold">Active Elections</p>
                <p className="text-sm text-muted">Browse &amp; vote now</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted" />
          </Link>
          <Link to="/leaderboard" className="glass-card flex items-center justify-between group" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3">
              <Trophy size={28} color="var(--green)" />
              <div>
                <p className="font-bold">Leaderboard</p>
                <p className="text-sm text-muted">See top candidates</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted" />
          </Link>
          <Link to="/analytics" className="glass-card flex items-center justify-between group" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3">
              <BarChart2 size={28} color="var(--navy)" />
              <div>
                <p className="font-bold">Analytics</p>
                <p className="text-sm text-muted">Live stats &amp; charts</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted" />
          </Link>
        </div>
      </motion.div>

      {/* Voting History */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold mb-4">Your Voting History</h2>
        {loading ? (
          <div className="loader"></div>
        ) : userVotes.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Vote size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-xl font-bold mb-2">No Votes Yet</p>
            <p className="text-muted mb-6">You haven't participated in any election yet. Your vote matters!</p>
            <Link to="/" className="btn btn-primary">Browse Elections</Link>
          </div>
        ) : (
          <div className="flex-col gap-4">
            {userVotes.map((vote, i) => (
              <motion.div key={i} variants={item} className="glass-card flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--saffron), var(--green))' }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{vote.electionId?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Election'}</p>
                    <p className="text-sm text-muted">Candidate ID: {vote.candidateId}</p>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-sm px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--green)' }}>
                  <ShieldCheck size={14} /> Recorded
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Logout Card */}
      <motion.div variants={item} className="glass-card flex justify-between items-center" style={{ borderTop: '4px solid #ef4444' }}>
        <div>
          <p className="font-bold text-lg">Sign Out</p>
          <p className="text-muted text-sm">You'll be redirected to the login page.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
          <LogOut size={18} /> Logout
        </button>
      </motion.div>

    </motion.div>
  );
}

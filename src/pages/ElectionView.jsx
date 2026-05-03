import API_BASE from '../api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertTriangle, Info, Vote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DiscussionBoard from '../components/DiscussionBoard';

export default function ElectionView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null); // ID of candidate currently being voted for
  const [showConfirm, setShowConfirm] = useState(null); // Candidate object for confirmation modal
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/api/elections/${id}`),
          fetch(`${API_BASE}/api/elections/${id}/candidates`)
        ]);
        
        if (!elRes.ok) throw new Error('Election not found');
        
        setElection(await elRes.json());
        setCandidates(await cRes.json());

        // Check if user already voted
        if (user) {
          const vRes = await fetch(`${API_BASE}/api/users/${user.id}/votes`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('votesphere_token')}` }
          });
          const votes = await vRes.json();
          if (votes.some(v => v.electionId === id)) {
            setHasVoted(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleVoteClick = (candidate) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowConfirm(candidate);
  };

  const confirmVote = async () => {
    setVotingId(showConfirm.id);
    const candidateId = showConfirm.id;
    setShowConfirm(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('votesphere_token')}`
        },
        body: JSON.stringify({ electionId: id, candidateId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHasVoted(true);
      setNotification({ type: 'success', message: 'Your vote has been securely recorded!' });
      
      // Update local state to reflect vote instantly
      setCandidates(candidates.map(c => 
        c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
      ));

    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setVotingId(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!election) return <div className="text-center mt-8 text-xl">Election not found.</div>;

  return (
    <div className="relative">
      {/* Notification Toast — fixed to viewport top-center */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              top: '5.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.75rem',
              borderRadius: '999px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              background: notification.type === 'success'
                ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                : 'linear-gradient(135deg, #dc2626, #ef4444)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12">
        <span className={`badge badge-${election.themeColor || 'navy'} mb-4`}>{election.country}</span>
        <h1 className="text-4xl mb-4">{election.title}</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">{election.description}</p>
      </div>

      {hasVoted && (
        <div className="glass-card mb-8 text-center" style={{ borderLeft: '4px solid var(--green)' }}>
          <CheckCircle2 size={48} className="mx-auto mb-4" color="var(--green)" />
          <h2 className="text-2xl mb-2">You Have Voted</h2>
          <p className="text-muted">Thank you for participating in democracy. Your vote is secure.</p>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/leaderboard')}>View Live Results</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-4">
        {candidates.map((candidate) => (
          <motion.div 
            key={candidate.id}
            whileHover={!hasVoted ? { scale: 1.02 } : {}}
            className="glass-card flex-col"
            style={{ opacity: hasVoted ? 0.7 : 1 }}
          >
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[var(--border-color)]">
              <div className="text-5xl bg-white p-2 rounded-full shadow-sm" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {candidate.symbol}
              </div>
              <div>
                <h3 className="text-xl font-bold">{candidate.name}</h3>
                <p className="text-sm font-semibold text-secondary">{candidate.party}</p>
              </div>
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="flex items-center gap-2 text-sm text-muted mb-2 font-bold text-[var(--navy)]"><Info size={16}/> Manifesto</h4>
              <p className="text-sm italic text-secondary">"{candidate.manifesto}"</p>
            </div>

            <button 
              className="btn w-full flex justify-center py-3 text-lg"
              onClick={() => handleVoteClick(candidate)}
              disabled={hasVoted || votingId === candidate.id}
              style={hasVoted ? {
                background: 'transparent',
                border: '2px solid #94a3b8',
                color: '#64748b',
              } : {
                background: {
                  saffron: '#f97316',
                  green:   '#16a34a',
                  blue:    '#2563eb',
                  navy:    '#1e3a8a',
                }[election.themeColor] || '#1e3a8a',
                color: 'white',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              {votingId === candidate.id ? (
                <span className="loader" style={{ width: '24px', height: '24px', margin: 0, borderWidth: '2px' }}></span>
              ) : hasVoted ? (
                '✓ Vote Recorded'
              ) : (
                <><Vote size={20} /> Cast Vote</>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <DiscussionBoard electionId={id} />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(null)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              zIndex: 9000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{showConfirm.symbol}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Confirm Your Vote
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600, fontSize: '1.1rem' }}>
                {showConfirm.name}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {showConfirm.party}
              </p>

              <div style={{
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                marginBottom: '2rem',
                fontSize: '0.85rem',
                color: 'var(--saffron)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                <AlertTriangle size={15} />
                This action is final and cannot be undone.
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.85rem' }}
                  onClick={() => setShowConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem', background: 'var(--green)' }}
                  onClick={confirmVote}
                >
                  ✓ Confirm Vote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

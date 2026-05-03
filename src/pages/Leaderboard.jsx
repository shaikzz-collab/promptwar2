import API_BASE from '../api';
import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Polling every 5 seconds for "real-time" feel
    const fetchLeaderboard = () => {
      fetch(`${API_BASE}/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
          setCandidates(data);
          setLoading(false);
        });
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxVotes = candidates.length > 0 ? candidates[0].votes : 1;
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-8">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Trophy size={48} color="var(--saffron)" />
        <h1 className="text-4xl gradient-text">Global Leaderboard</h1>
        <p className="text-muted text-lg">Real-time Top 100 Rankings</p>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={20} style={{
          position: 'absolute', left: '1.25rem', top: '50%', 
          transform: 'translateY(-50%)', color: 'var(--text-muted)',
          pointerEvents: 'none'
        }} />
        <input
          type="text"
          placeholder="Search candidates or parties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.25rem 1rem 3.25rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            fontSize: '1rem',
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontFamily: 'var(--font-main)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--saffron)'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
        />
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-muted w-16 text-center">Rank</th>
                  <th className="p-4 font-semibold text-muted">Candidate</th>
                  <th className="p-4 font-semibold text-muted hidden md:table-cell">Election</th>
                  <th className="p-4 font-semibold text-muted text-right">Votes</th>
                  <th className="p-4 font-semibold text-muted w-1/4 hidden sm:table-cell">Share</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => {
                  const percentage = ((candidate.votes / maxVotes) * 100).toFixed(1);
                  return (
                    <motion.tr 
                      key={candidate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <td className="p-4 text-center font-bold">
                        {index === 0 ? <Trophy size={20} color="gold" className="mx-auto" /> : 
                         index === 1 ? <Trophy size={20} color="silver" className="mx-auto" /> :
                         index === 2 ? <Trophy size={20} color="#cd7f32" className="mx-auto" /> : 
                         `#${index + 1}`}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{candidate.symbol}</span>
                          <div>
                            <div className="font-bold">{candidate.name}</div>
                            <div className="text-sm text-secondary">{candidate.party}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted hidden md:table-cell">{candidate.electionTitle}</td>
                      <td className="p-4 text-right font-bold text-lg">
                        <div className="flex items-center justify-end gap-2">
                          {candidate.votes.toLocaleString()}
                          {index === 0 && <TrendingUp size={16} color="var(--green)" />}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="progress-bg h-2">
                          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filteredCandidates.length === 0 && (
              <div className="text-center p-8 text-muted">No candidates found matching your search.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

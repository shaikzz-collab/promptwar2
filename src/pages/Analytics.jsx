import API_BASE from '../api';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar, Legend } from 'recharts';
import { PieChart as PieChartIcon, BarChart2, TrendingUp, Users, Vote, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#f97316', '#1e3a8a', '#16a34a', '#2563eb', '#7c3aed', '#db2777'];

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/analytics`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingTop: '5rem' }}>
      <div className="loader" />
      <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
    </div>
  );

  const totalVotes = data.electionParticipation.reduce((s, e) => s + e.totalVotes, 0);
  const topParty   = data.partyPerformance.sort((a,b) => b.votes - a.votes)[0];

  return (
    <motion.div
      className="flex-col gap-8"
      initial="hidden" animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
    >
      {/* Header */}
      <motion.div variants={cardVariant} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(22,163,74,0.3)' }}>
          <Activity size={34} color="white" />
        </div>
        <h1 className="text-4xl gradient-text">Live Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Real-time democratic participation data</p>
      </motion.div>

      {/* KPI Strip */}
      <motion.div variants={cardVariant} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: <Vote size={28} />, label: 'Total Votes Cast', value: totalVotes, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
          { icon: <Users size={28} />, label: 'Active Elections', value: data.electionParticipation.length, color: '#1e3a8a', bg: 'rgba(30,58,138,0.1)' },
          { icon: <TrendingUp size={28} />, label: 'Leading Party', value: null, text: topParty?.party || '-', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
          { icon: <PieChartIcon size={28} />, label: 'Parties Competing', value: data.partyPerformance.length, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
        ].map((kpi, i) => (
          <motion.div key={i} className="glass-card" whileHover={{ y: -4, scale: 1.02 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: `4px solid ${kpi.color}` }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{kpi.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {kpi.value !== null ? <AnimatedCounter end={kpi.value} /> : kpi.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={cardVariant} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

        {/* Donut Chart */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChartIcon size={22} color="var(--saffron)" /> Party Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.partyPerformance} cx="50%" cy="50%"
                innerRadius={65} outerRadius={110} paddingAngle={4}
                dataKey="votes" nameKey="party"
                label={({ party, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.partyPerformance.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: '0.75rem 1rem' }}
                formatter={(v, n) => [v.toLocaleString() + ' votes', n]}
              />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={22} color="var(--navy)" /> Election Participation
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.electionParticipation} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
                cursor={{ stroke: 'var(--saffron)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="totalVotes" name="Votes Cast"
                stroke="#f97316" strokeWidth={3} fill="url(#voteGrad)" dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Party Bar Breakdown */}
      <motion.div variants={cardVariant} className="glass-card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>📊 Detailed Party Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {data.partyPerformance
            .sort((a, b) => b.votes - a.votes)
            .map((party, i) => {
              const max = data.partyPerformance[0].votes;
              const pct = ((party.votes / max) * 100).toFixed(1);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{party.party}</span>
                    <span style={{ fontWeight: 700, color: COLORS[i % COLORS.length] }}>{party.votes.toLocaleString()} votes</span>
                  </div>
                  <div style={{ height: 10, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i+1) % COLORS.length]})` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>
    </motion.div>
  );
}

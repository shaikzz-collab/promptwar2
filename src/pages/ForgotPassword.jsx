import API_BASE from '../api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ShieldCheck, ArrowLeft, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['email', 'otp', 'reset', 'done'];

export default function ForgotPassword() {
  const [step, setStep]       = useState('email');
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showP1, setShowP1]   = useState(false);
  const [showP2, setShowP2]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  /* ── Step 1: send OTP ── */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(data.otp);   // demo: server returns OTP in response
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: verify OTP ── */
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError('');
    if (otp.trim() !== otpSent) { setError('Incorrect code. Please try again.'); return; }
    setStep('reset');
  };

  /* ── Step 3: reset password ── */
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    if (newPass !== confirm)      { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepIndex  = steps.indexOf(step);
  const slideDir   = 1;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{ maxWidth: '440px', width: '100%' }}
      >
        <div className="glass-card" style={{ padding: '3rem' }}>

          {/* Progress dots */}
          {step !== 'done' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {['email','otp','reset'].map((s, i) => (
                <div key={s} style={{
                  width: i <= stepIndex ? 28 : 8,
                  height: 8, borderRadius: 99,
                  background: i <= stepIndex
                    ? 'linear-gradient(90deg, #f97316, #1e3a8a)'
                    : 'var(--border-color)',
                  transition: 'all 0.4s ease',
                }} />
              ))}
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{
                  marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#dc2626', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Email ── */}
            {step === 'email' && (
              <motion.div key="email"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Mail size={30} color="white" />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Forgot Password?</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your registered email and we'll send you a reset code.</p>
                </div>
                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email" required value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        className="form-input" style={{ paddingLeft: '2.75rem' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                    {loading ? <><span className="loader" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> Sending...</> : <><RefreshCw size={17} /> Send Reset Code</>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 'otp' && (
              <motion.div key="otp"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <KeyRound size={30} color="white" />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Enter Reset Code</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A code was sent to <strong>{email}</strong></p>
                </div>

                {/* Demo OTP hint box */}
                <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '12px', padding: '0.875rem 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16a34a', marginBottom: '0.25rem' }}>🔔 DEMO MODE — Your OTP code is:</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.4em', color: '#16a34a' }}>{otpSent}</p>
                </div>

                <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>6-digit Code</label>
                    <input
                      type="text" required maxLength={6} value={otp} onChange={e => { setOtp(e.target.value); setError(''); }}
                      placeholder="_ _ _ _ _ _"
                      className="form-input" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 800 }}
                    />
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                    <ShieldCheck size={17} /> Verify Code
                  </motion.button>
                  <button type="button" onClick={() => setStep('email')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                    <ArrowLeft size={14} /> Back to email
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 'reset' && (
              <motion.div key="reset"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <KeyRound size={30} color="white" />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Set New Password</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose a strong password for your account.</p>
                </div>
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'New Password', val: newPass, set: setNewPass, show: showP1, toggle: () => setShowP1(!showP1) },
                    { label: 'Confirm Password', val: confirm, set: setConfirm, show: showP2, toggle: () => setShowP2(!showP2) },
                  ].map(({ label, val, set, show, toggle }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={show ? 'text' : 'password'} required value={val}
                          onChange={e => { set(e.target.value); setError(''); }}
                          placeholder="••••••••" className="form-input" style={{ paddingRight: '3rem' }}
                        />
                        <button type="button" onClick={toggle} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          {show ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Strength indicator */}
                  {newPass && (
                    <div>
                      <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 99, overflow: 'hidden' }}>
                        <motion.div
                          animate={{ width: newPass.length < 6 ? '25%' : newPass.length < 10 ? '60%' : '100%' }}
                          style={{ height: '100%', borderRadius: 99, background: newPass.length < 6 ? '#ef4444' : newPass.length < 10 ? '#f97316' : '#16a34a', transition: 'background 0.3s' }}
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: newPass.length < 6 ? '#ef4444' : newPass.length < 10 ? '#f97316' : '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
                        {newPass.length < 6 ? 'Weak' : newPass.length < 10 ? 'Fair' : '✓ Strong'}
                      </p>
                    </div>
                  )}

                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: '#16a34a' }} disabled={loading}>
                    {loading ? <><span className="loader" style={{ width: 18, height: 18, margin: 0, borderWidth: 2 }} /> Updating...</> : <><ShieldCheck size={17} /> Reset Password</>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 4: Done ── */}
            {step === 'done' && (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: '4rem', marginBottom: '1rem' }}
                >✅</motion.div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#16a34a' }}>Password Reset!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  Your password has been updated successfully. You can now login with your new credentials.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                  Go to Login →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to login */}
          {step === 'email' && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

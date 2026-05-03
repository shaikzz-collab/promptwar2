import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    state: '',
    age: '',
    fakeAadhaar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (parseInt(formData.age) < 18) {
      setError("You must be 18 or older to register to vote.");
      return;
    }
    
    if (formData.fakeAadhaar.length !== 12) {
       setError("Aadhaar ID must be 12 digits (Demo UI only).");
       return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-8">
          <Fingerprint size={48} className="mx-auto text-primary mb-4" color="var(--saffron)" />
          <h2 className="text-3xl gradient-text">Voter Registration</h2>
          <p className="text-muted">Securely verify your identity to participate.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" required onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" className="form-input" required min="1" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-input" required onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label flex justify-between">
              <span>Aadhaar Number (Demo)</span>
              <span className="text-xs text-muted">12 Digits required</span>
            </label>
            <input 
              type="text" 
              name="fakeAadhaar" 
              className="form-input" 
              maxLength="12" 
              pattern="\d{12}"
              placeholder="XXXX XXXX XXXX"
              required 
              onChange={handleChange} 
              style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Verifying Identity...' : 'Register as Voter'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted">Already registered? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

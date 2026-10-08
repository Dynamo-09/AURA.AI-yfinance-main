import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../AuthProvider';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      if (isSignup) {
        if (!firstName || !lastName || !username || !email || !password) {
          setErrorMsg('All fields are required.');
          return;
        }
        if (firstName && username.toLowerCase().includes(firstName.toLowerCase()) || lastName && username.toLowerCase().includes(lastName.toLowerCase())) {
          setErrorMsg('Username must not contain your First Name or Last Name.');
          return;
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,12}$/;
        if (!passwordRegex.test(password)) {
          setErrorMsg('Password must be 8-12 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              username: username,
            }
          }
        });

        if (error) throw error;
        // Wait for session to establish
      } else {
        if (!email || !password) {
            setErrorMsg('Email and password are required.');
            return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#090e19] font-body text-on-surface selection:bg-secondary/30 selection:text-secondary bg-[radial-gradient(circle_at_20%_30%,_rgba(137,172,255,0.08)_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_rgba(0,227,253,0.08)_0%,_transparent_40%),_#090e19]">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="w-full max-w-[460px] relative z-10 my-8">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-secondary">Aura.AI</h1>
          <p className="font-label uppercase tracking-[0.25em] text-[10px] text-on-surface-variant mt-2">The Synthesized Oracle</p>
        </div>

        <div className="glass-panel rounded-xl p-10 border border-outline-variant/10 shadow-[0px_40px_80px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-semibold mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-sm text-on-surface-variant">Analyze the markets with high-precision intelligence.</p>
          </div>
          <form className="space-y-6" onSubmit={handleAuth}>
            
            {errorMsg && (
              <div className="p-3 bg-error/10 border border-error/30 text-error text-sm rounded-lg">
                {errorMsg}
              </div>
            )}
            
            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant ml-1">First Name</label>
                    <input 
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all" 
                      placeholder="Jane" 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={isSignup}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant ml-1">Last Name</label>
                    <input 
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all" 
                      placeholder="Doe" 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={isSignup}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant ml-1">Username</label>
                  <input 
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3.5 px-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all" 
                    placeholder="janedoe_123" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isSignup}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant ml-1">Email Intelligence</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-secondary">
                  alternate_email
                </span>
                <input 
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all" 
                  placeholder="oracle@aura.ai" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant">Security Protocol</label>
                {!isSignup && <a className="text-[11px] uppercase tracking-widest text-secondary hover:text-secondary-fixed transition-colors" href="#">Forgot Cipher?</a>}
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-secondary">
                  lock
                </span>
                <input 
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all" 
                  placeholder="••••••••••••" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button disabled={loading} className="w-full bg-gradient-to-br from-primary to-primary-container py-4 rounded-full font-headline font-bold text-on-primary-container tracking-wide transition-all hover:shadow-[0px_0px_20px_rgba(0,227,253,0.35)] active:scale-95 duration-150 disabled:opacity-50" type="submit">
                {loading ? 'Processing...' : (isSignup ? 'Save & Initialize Account' : 'Initialize Session')}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-on-surface-variant">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button 
                className="text-secondary font-semibold hover:underline underline-offset-4 ml-1" 
                onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
          <a className="hover:text-on-surface-variant transition-colors" href="#">Compliance</a>
          <a className="hover:text-on-surface-variant transition-colors" href="#">API Keys</a>
          <a className="hover:text-on-surface-variant transition-colors" href="#">Neural Net Status</a>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
    </main>
  );
}

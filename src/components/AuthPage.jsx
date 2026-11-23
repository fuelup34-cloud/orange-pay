import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { Link, navigate } from '../router.jsx';
import { signIn, signUp, TEST_ACCOUNT } from '../auth.js';
import ThemeToggle from './ThemeToggle.jsx';
import './AuthPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode, { name, email, password }) {
  const errors = {};
  if (mode === 'signup' && !name.trim()) errors.name = 'Enter your name.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (mode === 'signup' && password.length < 8) errors.password = 'Use at least 8 characters.';
  if (mode === 'signin' && !password) errors.password = 'Enter your password.';
  return errors;
}

// mode is "signin" or "signup"; the same page handles both.
export default function AuthPage({ mode, onAuthed }) {
  const isSignUp = mode === 'signup';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = isSignUp ? 'Create your Strawberry Pay account' : 'Sign in to Strawberry Pay';
    setErrors({});
    setFormError('');
    return () => {
      document.title = 'Why Strawberry Pay';
    };
  }, [isSignUp]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(mode, form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      const user = isSignUp ? await signUp(form) : await signIn(form);
      onAuthed(user);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <header className="auth__top">
        <Link to="/" className="auth__brand" aria-label="Strawberry Pay home">
          <Logo size={22} />
        </Link>
        <ThemeToggle />
      </header>

      <main className="auth__main">
        <div className="auth__card">
          <h1 className="auth__title">{isSignUp ? 'Create your account' : 'Sign in'}</h1>
          <p className="auth__sub">
            {isSignUp ? 'One account for paying and getting paid.' : 'Welcome back to Strawberry Pay.'}
          </p>

          <p className="auth__demo">Demo only: accounts you create last until you reload the page and aren't sent anywhere.</p>

          {!isSignUp && (
            <div className="auth__test">
              <div>
                <strong>Test account</strong>
                <span>
                  {TEST_ACCOUNT.email} · {TEST_ACCOUNT.password}
                </span>
              </div>
              <button
                type="button"
                className="auth__test-fill"
                onClick={() => {
                  setForm({ name: '', email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password });
                  setErrors({});
                  setFormError('');
                }}
              >
                Use it
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="auth__form">
            {isSignUp && (
              <label className="field">
                <span>Full name</span>
                <input
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <small>{errors.name}</small>}
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <small>{errors.email}</small>}
            </label>

            <label className="field">
              <span>Password</span>
              <div className="auth__password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="auth__reveal"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <small>{errors.password}</small>}
              {isSignUp && !errors.password && <em className="auth__hint">At least 8 characters.</em>}
            </label>

            {formError && (
              <p className="auth__error" role="alert">
                {formError}
              </p>
            )}

            <button type="submit" className="btn auth__submit" disabled={busy}>
              {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="auth__switch">
            {isSignUp ? (
              <>
                Already have an account? <Link to="/signin">Sign in</Link>
              </>
            ) : (
              <>
                New to Strawberry Pay? <Link to="/signup">Create an account</Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

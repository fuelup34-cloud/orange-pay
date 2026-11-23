import { useRef, useState } from 'react';
import { changePassword, updateAvatar, updateProfile } from '../auth.js';
import { AVATAR_ACCEPT, makeAvatar } from '../avatar.js';
import Avatar from './Avatar.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The "Account" part of the dashboard: shows the profile, and lets the
// user edit their name and email or change their password.
export default function AccountSection({ user, onUserChange, onSignOut }) {
  // 'view' | 'profile' | 'password': which form (if any) is open.
  const [mode, setMode] = useState('view');
  const [notice, setNotice] = useState('');

  function finish(message) {
    setMode('view');
    setNotice(message);
  }

  return (
    <section id="account" className="dash__panel dash__section">
      <div className="dash__panel-head">
        <h2>Account</h2>
        {mode === 'view' && (
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => {
              setNotice('');
              setMode('profile');
            }}
          >
            Edit
          </button>
        )}
      </div>

      {notice && (
        <p className="acct__notice" role="status">
          ✓ {notice}
        </p>
      )}

      {mode === 'view' && (
        <>
          <PhotoPicker user={user} onUserChange={onUserChange} onNotice={setNotice} />
          <dl className="dash__details">
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>••••••••</dd>
            </div>
            <div>
              <dt>Plan</dt>
              <dd>Personal · Free</dd>
            </div>
          </dl>
          <div className="acct__actions">
            <button
              type="button"
              className="acct__link"
              onClick={() => {
                setNotice('');
                setMode('password');
              }}
            >
              Change password
            </button>
            <button type="button" className="btn btn--dark btn--sm" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </>
      )}

      {mode === 'profile' && (
        <ProfileForm
          user={user}
          onCancel={() => setMode('view')}
          onSaved={(updated) => {
            onUserChange(updated);
            finish('Your details were updated.');
          }}
        />
      )}

      {mode === 'password' && (
        <PasswordForm user={user} onCancel={() => setMode('view')} onSaved={() => finish('Your password was changed.')} />
      )}
    </section>
  );
}

function ProfileForm({ user, onCancel, onSaved }) {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const unchanged = form.name.trim() === user.name && form.email.trim().toLowerCase() === user.email;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = 'Enter your name.';
    if (!EMAIL_PATTERN.test(form.email.trim())) found.email = 'Enter a valid email address.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      onSaved(await updateProfile(user.email, form));
    } catch (err) {
      setFormError(err.message);
      setBusy(false);
    }
  }

  return (
    <form className="acct__form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Full name</span>
        <input
          autoComplete="name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={!!errors.name}
          autoFocus
        />
        {errors.name && <small>{errors.name}</small>}
      </label>
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

      {formError && (
        <p className="auth__error" role="alert">
          {formError}
        </p>
      )}

      <div className="acct__buttons">
        <button type="button" className="acct__cancel" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn btn--sm" disabled={busy || unchanged}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function PasswordForm({ user, onCancel, onSaved }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    if (!form.currentPassword) found.currentPassword = 'Enter your current password.';
    if (form.newPassword.length < 8) found.newPassword = 'Use at least 8 characters.';
    else if (form.newPassword === form.currentPassword) found.newPassword = 'Choose a different password.';
    if (form.confirm !== form.newPassword) found.confirm = "Passwords don't match.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await changePassword(user.email, form);
      onSaved();
    } catch (err) {
      setFormError(err.message);
      setBusy(false);
    }
  }

  const fields = [
    { key: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
    { key: 'newPassword', label: 'New password', autoComplete: 'new-password' },
    { key: 'confirm', label: 'Confirm new password', autoComplete: 'new-password' },
  ];

  return (
    <form className="acct__form" onSubmit={handleSubmit} noValidate>
      {/* Hidden username field helps password managers know which account this is */}
      <input type="email" autoComplete="username" value={user.email} readOnly hidden />
      {fields.map((f, i) => (
        <label className="field" key={f.key}>
          <span>{f.label}</span>
          <input
            type="password"
            autoComplete={f.autoComplete}
            value={form[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            aria-invalid={!!errors[f.key]}
            autoFocus={i === 0}
          />
          {errors[f.key] && <small>{errors[f.key]}</small>}
        </label>
      ))}

      {formError && (
        <p className="auth__error" role="alert">
          {formError}
        </p>
      )}

      <div className="acct__buttons">
        <button type="button" className="acct__cancel" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn btn--sm" disabled={busy}>
          {busy ? 'Saving…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}

// Profile picture with "Upload photo" / "Remove" buttons.
// Pictures can also be dropped onto the photo.
function PhotoPicker({ user, onUserChange, onNotice }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function save(avatar, message) {
    setBusy(true);
    setError('');
    onNotice('');
    try {
      onUserChange(await updateAvatar(user.email, avatar));
      onNotice(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(file) {
    if (!file) return;
    setError('');
    try {
      const avatar = await makeAvatar(file);
      await save(avatar, 'Your photo was updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="photo">
      <button
        type="button"
        className={`photo__drop ${dragging ? 'is-dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        disabled={busy}
        aria-label={user.avatar ? 'Change profile photo' : 'Upload profile photo'}
      >
        <Avatar user={user} size={72} />
        <span className="photo__badge" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>
      </button>

      <div className="photo__text">
        <strong>Profile photo</strong>
        <span>JPG, PNG, WebP or GIF, up to 10 MB. It's cropped to a square.</span>
        <div className="photo__buttons">
          <button type="button" className="acct__link" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Saving…' : user.avatar ? 'Change photo' : 'Upload photo'}
          </button>
          {user.avatar && !busy && (
            <button type="button" className="acct__link cards__danger" onClick={() => save(null, 'Your photo was removed.')}>
              Remove
            </button>
          )}
        </div>
        {error && (
          <small className="photo__error" role="alert">
            {error}
          </small>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        hidden
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = ''; // so picking the same file again still triggers a change
        }}
      />
    </div>
  );
}

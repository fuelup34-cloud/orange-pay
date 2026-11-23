// DEMO ACCOUNTS: this site has no server, so accounts are kept in a plain
// in-memory list. Accounts you create disappear when the page reloads, and nothing is sent anywhere.
//
// To make sign-in real, replace the bodies of signUp() and signIn() with
// requests to your backend (e.g. fetch('/api/signin', ...)). Never store
// passwords in the browser.

// A ready-made account for trying the site. Shown on the sign-in page.
export const TEST_ACCOUNT = {
  name: 'Alex Morgan',
  email: 'test@example.com',
  password: 'orange123',
};

const accounts = new Map(); // email -> { name, email, password }
accounts.set(TEST_ACCOUNT.email, { ...TEST_ACCOUNT });

// The details the rest of the app is allowed to see (never the password).
function publicUser(account) {
  return { name: account.name, email: account.email, avatar: account.avatar ?? null };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signUp({ name, email, password }) {
  await wait(500); // pretend to talk to a server
  const key = email.trim().toLowerCase();
  if (accounts.has(key)) {
    throw new Error('An account with this email already exists. Try signing in.');
  }
  accounts.set(key, { name: name.trim(), email: key, password });
  return publicUser(accounts.get(key));
}

export async function signIn({ email, password }) {
  await wait(500);
  const account = accounts.get(email.trim().toLowerCase());
  // Use the same message for both cases so it doesn't reveal which emails have accounts.
  if (!account || account.password !== password) {
    throw new Error('Email or password is incorrect.');
  }
  return publicUser(account);
}

// Change the name and/or email of the signed-in account.
export async function updateProfile(currentEmail, { name, email }) {
  await wait(400);
  const account = accounts.get(currentEmail);
  if (!account) throw new Error('Your session has ended. Please sign in again.');

  const newEmail = email.trim().toLowerCase();
  if (newEmail !== currentEmail && accounts.has(newEmail)) {
    throw new Error('Another account already uses this email.');
  }

  const updated = { ...account, name: name.trim(), email: newEmail };
  accounts.delete(currentEmail);
  accounts.set(newEmail, updated);
  return publicUser(updated);
}

// Change the password after checking the current one.
export async function changePassword(email, { currentPassword, newPassword }) {
  await wait(400);
  const account = accounts.get(email);
  if (!account) throw new Error('Your session has ended. Please sign in again.');
  if (account.password !== currentPassword) throw new Error('Current password is incorrect.');
  account.password = newPassword;
}

// Set or remove (avatar = null) the profile picture.
export async function updateAvatar(email, avatar) {
  await wait(300);
  const account = accounts.get(email);
  if (!account) throw new Error('Your session has ended. Please sign in again.');
  account.avatar = avatar;
  return publicUser(account);
}

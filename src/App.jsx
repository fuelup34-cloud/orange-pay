import { useState } from 'react';
import { useRoute } from './router.jsx';
import { SAMPLE_CARD, makeCardId } from './cards.js';
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import AddCardModal from './components/AddCardModal.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Benefits from './components/Benefits.jsx';
import Stats from './components/Stats.jsx';
import Security from './components/Security.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import AcceptPayments from './components/AcceptPayments.jsx';
import FAQ from './components/FAQ.jsx';
import GetStarted from './components/GetStarted.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // The cards in Wallet. They only live in memory, so reloading resets them.
  const [cards, setCards] = useState([SAMPLE_CARD]);
  const [addingCard, setAddingCard] = useState(false);
  // The signed-in user ({ name, email }), or null when signed out.
  const [user, setUser] = useState(null);
  const path = useRoute();

  function handleAdd(newCard) {
    setCards((list) => [...list, { ...newCard, id: makeCardId(), nickname: newCard.brand }]);
    // On the home page, scroll back to the phone so the visitor sees their card on it.
    if (path === '/') document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
  }

  function renameCard(id, nickname) {
    setCards((list) => list.map((c) => (c.id === id ? { ...c, nickname } : c)));
  }

  function removeCard(id) {
    setCards((list) => list.filter((c) => c.id !== id));
  }

  // Pick which page to show from the URL path.
  let page;
  if (path === '/signin' || path === '/signup') {
    page = <AuthPage mode={path.slice(1)} onAuthed={setUser} />;
  } else if (path === '/dashboard') {
    page = (
      <Dashboard
        user={user}
        cards={cards}
        onAddCard={() => setAddingCard(true)}
        onRenameCard={renameCard}
        onRemoveCard={removeCard}
        onSignOut={() => setUser(null)}
        onUserChange={setUser}
      />
    );
  } else {
    page = (
      <>
        <Nav user={user} onSignOut={() => setUser(null)} />
        <main>
          {/* The phone shows the most recently added card (or a sample if Wallet is empty) */}
          <Hero card={cards[cards.length - 1]} />
          <Benefits />
          <Stats />
          <Security />
          <HowItWorks />
          <AcceptPayments />
          <FAQ />
          <GetStarted onAddCard={() => setAddingCard(true)} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {page}
      <AddCardModal open={addingCard} onClose={() => setAddingCard(false)} onAdd={handleAdd} />
    </>
  );
}

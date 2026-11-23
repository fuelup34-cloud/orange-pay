import Reveal from './Reveal.jsx';
import './Sections.css';

export default function GetStarted({ onAddCard }) {
  return (
    <section className="section getstarted" id="get-started">
      <div className="container">
        <Reveal className="getstarted__card text-center">
          <h2 className="headline">Ready when you are.</h2>
          <p className="subhead getstarted__sub">Set up Strawberry Pay today. It only takes a minute.</p>
          <div className="cta-row">
            <button type="button" className="btn btn--dark" onClick={onAddCard}>Add a card</button>
            <a href="#accept" className="link-arrow getstarted__link">Accept Strawberry Pay</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

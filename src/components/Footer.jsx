import './Sections.css';

const columns = [
  { title: 'Strawberry Pay', links: ['Overview', 'How it works', 'Security', 'Where to use'] },
  { title: 'For Business', links: ['Accept payments', 'Developers', 'Partners', 'Marketing guidelines'] },
  { title: 'Support', links: ['Help center', 'Lost device', 'Contact us', 'Status'] },
  { title: 'Company', links: ['About', 'Newsroom', 'Careers', 'Privacy'] },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__note">
          Strawberry Pay is a fictional demo product. Card eligibility, availability and features shown on this page are for illustration only.
        </p>
        <nav className="footer__cols" aria-label="Footer">
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="footer__title">{c.title}</h3>
              <ul>
                {c.links.map((l) => (
                  <li key={l}><a href="#top">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footer__bottom">
          <span>Copyright © {year} Strawberry Pay Inc. All rights reserved.</span>
          <span className="footer__legal">
            <a href="#top">Privacy Policy</a>
            <a href="#top">Terms of Use</a>
            <a href="#top">Legal</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

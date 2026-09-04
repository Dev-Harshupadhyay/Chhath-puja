import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function NotFound() {
  return (
    <div className="shell" style={{ paddingBlock: 'var(--s-20)', textAlign: 'center' }}>
      <span className="eyebrow" style={{ justifyContent: 'center' }}>
        404
      </span>
      <h1 className="deva" style={{ marginTop: 12 }}>
        यह पन्ना नहीं मिला
      </h1>
      <p style={{ marginTop: 10, color: 'var(--text-muted)' }}>
        Jo page dhoondh rahe hain woh yahaan nahi hai.
      </p>
      <Link className="btn btn--primary" to="/" style={{ marginTop: 24 }}>
        <Icon name="home" size={16} /> Home
      </Link>
    </div>
  );
}

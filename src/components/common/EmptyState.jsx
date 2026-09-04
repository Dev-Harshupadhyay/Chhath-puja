import Icon from '../Icon';

export default function EmptyState({ icon = 'music', title, body, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} size={30} />
      </div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

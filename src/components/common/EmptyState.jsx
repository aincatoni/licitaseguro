import { Link } from "react-router-dom";

function EmptyState({ title, message, actionLabel, onAction, href }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && href ? (
        <Link className="button button-secondary" to={href}>
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction && !href ? (
        <button className="button button-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;

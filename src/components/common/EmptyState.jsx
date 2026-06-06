function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button className="button button-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;

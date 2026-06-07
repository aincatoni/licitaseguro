function NoticeBanner({ tone = "info", message }) {
  if (!message) {
    return null;
  }

  const role = tone === "error" ? "alert" : "status";

  return (
    <div className={`notice-banner notice-banner-${tone}`} role={role} aria-live="polite">
      <p>{message}</p>
    </div>
  );
}

export default NoticeBanner;

function LoadingState({ title = "Cargando informacion...", message = "Espera unos segundos mientras consultamos el servicio." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__spinner" aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container vh-100 d-flex flex-column align-items-center justify-content-center text-center">
          <div className="mb-4">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="mb-3">Algo salió mal</h2>
          <p className="text-muted mb-4">
            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </p>
          <div className="d-flex gap-3">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Recargar página
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Intentar de nuevo
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-start w-100" style={{ maxWidth: '600px' }}>
              <summary className="btn btn-sm btn-outline-secondary mb-2">
                Ver detalles del error
              </summary>
              <pre className="bg-dark text-white p-3 rounded" style={{ fontSize: '0.85rem', overflow: 'auto' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

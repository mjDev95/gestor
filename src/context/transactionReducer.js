const transactionReducer = (state, action) => {
  console.log("Acción:", action.type, "Payload:", action.payload); 
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    case 'SET_TARJETAS':
      return {
        ...state,
        tarjetas: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_TRANSACTION':
      const updatedTransactions = [action.payload, ...state.transactions].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      return {
        ...state,
        transactions: updatedTransactions,
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload, // O acumular: [...(state.error || []), action.payload]
        loading: false,
      };
    default:
      console.warn(`Acción desconocida: ${action.type}`);
      return state;
  }
};

export default transactionReducer;
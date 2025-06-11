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
    case "SET_MES_ANTERIOR":
      return {
        ...state,
        mesAnterior: action.payload,
      };
    case 'SET_TARJETAS':
      return {
        ...state,
        tarjetas: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          actual: [action.payload, ...(state.transactions.actual || [])]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
        },
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          actual: (state.transactions.actual || []).filter(
            (transaction) => transaction.id !== action.payload
          ),
          previo: (state.transactions.previo || []).filter(
            (transaction) => transaction.id !== action.payload
          ),
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload, 
        loading: false,
      };
    default:
      console.warn(`Acción desconocida: ${action.type}`);
      return state;
  }
};

export default transactionReducer;
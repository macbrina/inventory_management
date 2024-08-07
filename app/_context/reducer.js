export function inventoryReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME_MODE":
      return {
        ...state,
        themeMode: state.themeMode === "dark" ? "light" : "dark",
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "TOGGLE_DRAWER_MODE":
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case "SET_PATHNAME":
      return {
        ...state,
        pathname: action.payload,
      };
    case "SEARCH_PRODUCTS":
      return {
        ...state,
        productSearch: action.payload,
      };
    case "SEARCH_CATEGORIES":
      return {
        ...state,
        categorySearch: action.payload,
      };
    case "SET_PRODUCT_LIST":
      return {
        ...state,
        productList: action.payload,
      };
    case "SET_CATEGORY_LIST":
      return {
        ...state,
        categoryList: action.payload,
      };
    case "SET_CATEGORY_LOADING":
      return {
        ...state,
        categoryLoading: action.payload,
      };
    case "SET_PRODUCT_LOADING":
      return {
        ...state,
        productLoading: action.payload,
      };
    case "SET_RECIPE_SEARCH":
      return {
        ...state,
        recipeSearch: action.payload,
      };
    case "SET_RECIPE_LIST":
      return {
        ...state,
        recipeList: action.payload,
      };
    case "SET_RECIPE_LOADING":
      return {
        ...state,
        recipeLoading: action.payload,
      };
    case "SET_RECIPE_SUGGESTIONS":
      return {
        ...state,
        recipeSuggestions: action.payload,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

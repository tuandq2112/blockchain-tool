const auth = {
  state: {
    users: [],
    isLoading: false,
  }, // initial state
  reducers: {
    updateData(payload = {}, state) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {},
};

export default auth;

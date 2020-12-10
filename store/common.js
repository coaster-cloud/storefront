export default {
  state: {
    loading: 0,
    editMode: false
  },

  mutations: {
    setLoading (state, value) {
      state.loading = value === true ? state.loading + 1 : state.loading - 1
    },

    setEditMode (state, value) {
      state.editMode = value
    }
  },
  getters: {
    isLoading (state) {
      return state.loading > 0
    }
  }
}

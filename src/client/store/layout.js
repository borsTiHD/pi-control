// Root Store
export const state = () => ({
    drawer: false
})

// Sync functions for setting data
export const mutations = {
    setDrawer(state, payload) {
        state.drawer = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setDrawer({ commit }, payload) {
        commit('setDrawer', payload)
    }
}

// Getting computed data
export const getters = {
    getDrawer(state) {
        return state.drawer
    }
}

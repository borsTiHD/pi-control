// Root Store
export const state = () => ({
    autoRefresh: true
})

// Sync functions for setting data
export const mutations = {
    setAutoRefresh(state, payload) {
        state.autoRefresh = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setAutoRefresh({ commit }, payload) {
        commit('setAutoRefresh', payload)
    }
}

// Getting computed data
export const getters = {
    getAutoRefresh(state) {
        return state.autoRefresh
    }
}

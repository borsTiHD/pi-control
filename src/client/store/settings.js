// Root Store
export const state = () => ({
    darkMode: true,
    autoRefresh: true,
    alreadyVisited: false
})

// Sync functions for setting data
export const mutations = {
    setDarkMode(state, payload) {
        state.darkMode = payload
    },
    setAutoRefresh(state, payload) {
        state.autoRefresh = payload
    },
    setAlreadyVisited(state, payload) {
        state.alreadyVisited = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setDarkMode({ commit }, payload) {
        commit('setDarkMode', payload)
    },
    setAutoRefresh({ commit }, payload) {
        commit('setAutoRefresh', payload)
    },
    setAlreadyVisited({ commit }, payload) {
        commit('setAlreadyVisited', payload)
    }
}

// Getting computed data
export const getters = {
    getDarkMode(state) {
        return state.darkMode
    },
    getAutoRefresh(state) {
        return state.autoRefresh
    },
    getAlreadyVisited(state) {
        return state.alreadyVisited
    }
}

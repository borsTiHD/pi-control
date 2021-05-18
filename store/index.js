// Root Store
export const state = () => ({
    newRelease: false
})

// Sync functions for setting data
export const mutations = {
    setNewRelease(state, payload) {
        state.newRelease = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setNewRelease({ commit }, payload) {
        commit('setNewRelease', payload)
    }
}

// Getting computed data
export const getters = {
    getNewRelease(state) {
        return state.newRelease
    }
}

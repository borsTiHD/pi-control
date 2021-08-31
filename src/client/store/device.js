// Root Store
export const state = () => ({
    currentDeviceId: null
})

// Sync functions for setting data
export const mutations = {
    setCurrentDeviceId(state, payload) {
        state.currentDeviceId = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setCurrentDeviceId({ commit }, payload) {
        commit('setCurrentDeviceId', payload)
    }
}

// Getting computed data
export const getters = {
    getCurrentDeviceId(state) {
        return state.currentDeviceId
    }
}

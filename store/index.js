// Root Store
export const state = () => ({
    newRelease: false,
    releaseData: null
})

// Sync functions for setting data
export const mutations = {
    setNewRelease(state, payload) {
        state.newRelease = payload
    },
    setReleaseData(state, payload) {
        state.releaseData = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setNewRelease({ commit }, payload) {
        commit('setNewRelease', payload)
    },
    setReleaseData({ commit }, payload) {
        commit('setReleaseData', payload)
    }
}

// Getting computed data
export const getters = {
    isNewRelease(state) {
        return state.newRelease
    },
    getReleaseData(state) {
        return state.releaseData
    }
}

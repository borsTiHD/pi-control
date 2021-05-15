// Root Store
export const state = () => ({
    kernelData: null,
    operatingSystem: null
})

// Sync functions for setting data
export const mutations = {
    setKernelData(state, payload) {
        state.kernelData = payload
    },
    setOperatingSystem(state, payload) {
        state.operatingSystem = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setKernelData({ commit }, payload) {
        commit('setKernelData', payload)
    },
    setOperatingSystem({ commit }, payload) {
        commit('setOperatingSystem', payload)
    }
}

// Getting computed data
export const getters = {
    getKernelData(state) {
        return state.kernelData
    },
    getOperatingSystem(state) {
        return state.operatingSystem
    }
}

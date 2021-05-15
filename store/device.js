// Root Store
export const state = () => ({
    kernelData: null,
    operatingSystem: null,
    hardwareData: null,
    diskData: null,
    memoryData: null
})

// Sync functions for setting data
export const mutations = {
    setKernelData(state, payload) {
        state.kernelData = payload
    },
    setOperatingSystem(state, payload) {
        state.operatingSystem = payload
    },
    setHardwareData(state, payload) {
        state.hardwareData = payload
    },
    setDiskData(state, payload) {
        state.diskData = payload
    },
    setMemoryData(state, payload) {
        state.memoryData = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setKernelData({ commit }, payload) {
        commit('setKernelData', payload)
    },
    setOperatingSystem({ commit }, payload) {
        commit('setOperatingSystem', payload)
    },
    setHardwareData({ commit }, payload) {
        commit('setHardwareData', payload)
    },
    setDiskData({ commit }, payload) {
        commit('setDiskData', payload)
    },
    setMemoryData({ commit }, payload) {
        commit('setMemoryData', payload)
    }
}

// Getting computed data
export const getters = {
    getKernelData(state) {
        return state.kernelData
    },
    getOperatingSystem(state) {
        return state.operatingSystem
    },
    getHardwareData(state) {
        return state.hardwareData
    },
    getDiskData(state) {
        return state.diskData
    },
    getMemoryData(state) {
        return state.memoryData
    }
}

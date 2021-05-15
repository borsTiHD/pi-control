// Root Store
export const state = () => ({
    kernelData: null,
    operatingSystem: null,
    hardwareData: null,
    cpuCores: null,
    topData: null,
    diskData: null,
    memoryData: null,
    temperatureData: null
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
    setCpuCores(state, payload) {
        state.cpuCores = payload
    },
    setTopData(state, payload) {
        state.topData = payload
    },
    setDiskData(state, payload) {
        state.diskData = payload
    },
    setMemoryData(state, payload) {
        state.memoryData = payload
    },
    setTemperatureData(state, payload) {
        state.temperatureData = payload
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
    setCpuCores({ commit }, payload) {
        commit('setCpuCores', payload)
    },
    setTopData({ commit }, payload) {
        commit('setTopData', payload)
    },
    setDiskData({ commit }, payload) {
        commit('setDiskData', payload)
    },
    setMemoryData({ commit }, payload) {
        commit('setMemoryData', payload)
    },
    setTemperatureData({ commit }, payload) {
        commit('setTemperatureData', payload)
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
    getCpuCores(state) {
        return state.cpuCores
    },
    getTopData(state) {
        return state.topData
    },
    getDiskData(state) {
        return state.diskData
    },
    getMemoryData(state) {
        return state.memoryData
    },
    getTemperatureData(state) {
        return state.temperatureData
    }
}

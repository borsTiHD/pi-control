// Root Store
export const state = () => ({
    drawer: false,
    rightDrawer: false
})

// Sync functions for setting data
export const mutations = {
    setDrawer(state, payload) {
        state.drawer = payload
    },
    setRightDrawer(state, payload) {
        state.rightDrawer = payload
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    setDrawer({ commit }, payload) {
        commit('setDrawer', payload)
    },
    setRightDrawer({ commit }, payload) {
        commit('setRightDrawer', payload)
    }
}

// Getting computed data
export const getters = {
    getDrawer(state) {
        return state.drawer
    },
    getRightDrawer(state) {
        return state.rightDrawer
    }
}

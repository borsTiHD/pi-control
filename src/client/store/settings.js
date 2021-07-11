import Vue from 'vue'

// Root Store
export const state = () => ({
    autoRefresh: true,
    alreadyVisited: false,
    design: {
        skin: 'Default',
        darkMode: true,
        elevation: 0,
        outlined: true,
        custom: {} // Custom Theme Colors
    }
})

// Sync functions for setting data
export const mutations = {
    setDarkMode(state, payload) {
        state.design.darkMode = payload
    },
    setElevation(state, payload) {
        state.design.elevation = payload
    },
    setOutlined(state, payload) {
        state.design.outlined = payload
    },
    setActiveSkin(state, payload) {
        state.design.skin = payload
    },
    setCustomTheme(state, payload) {
        Vue.set(state.design, 'custom', payload) // Using 'Vue.set' so the object will be reactive for Vue
        // state.design.custom = payload
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
    setElevation({ commit }, payload) {
        commit('setElevation', payload)
    },
    setOutlined({ commit }, payload) {
        commit('setOutlined', payload)
    },
    setActiveSkin({ commit }, payload) {
        commit('setActiveSkin', payload)
    },
    setCustomTheme({ commit }, payload) {
        commit('setCustomTheme', payload)
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
        return state.design.darkMode
    },
    getElevation(state) {
        return state.design.elevation
    },
    getOutlined(state) {
        return state.design.outlined
    },
    getActiveSkin(state) {
        return state.design.skin
    },
    getCustomTheme(state) {
        return state.design.custom
    },
    getAutoRefresh(state) {
        return state.autoRefresh
    },
    getAlreadyVisited(state) {
        return state.alreadyVisited
    }
}

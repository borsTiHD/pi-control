// Root Store
export const state = () => ({
    terminals: []
})

// Sync functions for setting data
export const mutations = {
}

// Async functions for setting data and calling mutations
export const actions = {
    SOCKET_terminal({ commit, getters }, payload) {
        // Socket Event 'terminal': Saving buffer data
        // payload = { _status: 'ok', id: terminalId, data }
        console.log('STORE SOCKET:', payload)
    }
}

// Getting computed data
export const getters = {
}

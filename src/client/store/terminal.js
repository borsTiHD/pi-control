import Vue from 'vue'

// Root Store
export const state = () => ({
    terminals: [],
    maxBufferSize: 15000,
    bufferOffset: 14000
})

// Sync functions for setting data
export const mutations = {
    addTerminalBuffer(state, terminlID) {
        // Don't use this mutation... use the action instead
        if (!state.terminals.find((terminal) => terminal.id === terminlID)) {
            state.terminals.push({ id: terminlID, buffer: '' })
        }
    },
    deleteTerminalBuffer(state, terminlID) {
        // Don't use this mutation... use the action instead
        const index = state.terminals.findIndex((terminal) => terminal.id === terminlID)
        if (index !== -1) {
            // Delete terminal object from store
            Vue.delete(state.terminals, index)
        }
    },
    deleteAllTerminalBuffer(state, payload) {
        // Don't use this mutation... use the action instead
        state.terminals = []
    },
    appendBuffer(state, payload) {
        // Don't use this mutation... use the action instead
        const index = state.terminals.findIndex((terminal) => terminal.id === payload.id)
        if (index !== -1) {
            // Appends buffer data
            state.terminals[index].buffer += payload.data

            // Checking size of buffer
            const bufferLength = state.terminals[index].buffer.length
            const maxBufferSize = state.maxBufferSize
            const bufferOffset = state.bufferOffset
            if (bufferLength > maxBufferSize) {
                // Buffer too long - cutting buffer / older data will be deleted
                state.terminals[index].buffer = state.terminals[index].buffer.slice(bufferLength - bufferOffset)
            }
        } else {
            // Terminal Id not in store - add terminal Id to store with current buffer data
            state.terminals.push({ id: payload.id, buffer: payload.data })
        }
    }
}

// Async functions for setting data and calling mutations
export const actions = {
    addTerminalBuffer({ commit, state }, terminlID) {
        // Adds new buffer for the terminal Id, if the Id did not exists
        if (!state.terminals.find((terminal) => terminal.id === terminlID)) {
            commit('addTerminalBuffer', terminlID)
        }
    },
    deleteTerminalBuffer({ commit, state }, terminlID) {
        // Deletes terminal object if it exists
        const index = state.terminals.findIndex((terminal) => terminal.id === terminlID)
        if (index !== -1) {
            commit('deleteTerminalBuffer', terminlID)
        }
    },
    deleteAllTerminalBuffer({ commit, state }, payload) {
        // Deletes all terminal objects
        commit('deleteAllTerminalBuffer', payload)
    },
    appendBuffer({ commit }, payload) {
        // Appends buffer data if terminal Id exists, or create new terminal with new buffer
        commit('appendBuffer', { id: payload.id, data: payload.data })
    },
    SOCKET_terminal({ commit, state }, payload) {
        // Socket Event 'terminal': Append buffer data
        // payload = { _status: 'ok', type: 'data', id: terminalId, data }
        if (payload._status === 'ok' && payload.type === 'data') {
            commit('appendBuffer', { id: payload.id, data: payload.data })
        }
    }
}

// Getting computed data
export const getters = {
    getTerminalBuffer: (state) => (terminlID) => {
        // Returns terminal buffer
        const terminal = state.terminals.find((terminal) => terminal.id === terminlID)
        return terminal?.buffer
    },
    getMaxBufferSize(state) {
        // Returns max buffer size
        return state.maxBufferSize
    }
}

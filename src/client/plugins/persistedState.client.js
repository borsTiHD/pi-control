import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
    createPersistedState({
        // Vuex stores that should remain stored
        paths: ['settings', 'layout']
    })(store)
}

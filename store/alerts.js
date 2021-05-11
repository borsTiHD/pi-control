import Vue from 'vue'

// Module Store
export const state = () => ({
    alerts: []
})

// Sync functions for Alert data
export const mutations = {
    pushAlert(state, payload) {
        state.alerts.push(payload)
    },
    clearAll(state) {
        state.alerts = []
    },
    clearAlertByIndex(state, index) {
        // Löscht Alert bei Index
        if (index !== -1) {
            console.log('[Alert] -> Folgender Alert wird gelöscht:', state.alerts[index])
            Vue.delete(state.alerts, index)
        }
    },
    clearAlertsByGroup(state, group) {
        // Löscht Alerts bei Gruppen Name
        console.log(`[Alert] -> Alerts der Gruppe "${group}" werden gelöscht:`, state.alerts.filter((alert) => alert.group === group))
        state.alerts = state.alerts.filter((alert) => alert.group !== group)
    }
}

// Getting computed data
export const getters = {
    getAlerts(state) {
        return state.alerts
    }
}

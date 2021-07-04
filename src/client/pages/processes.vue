<template>
    <v-row justify="center">
        <v-col class="d-flex flex-column">
            <v-card class="flex d-flex flex-column">
                <v-card-title class="headline">
                    <v-icon
                        large
                        color="primary"
                        class="mr-2"
                    >
                        mdi-chip
                    </v-icon>
                    Processes
                    <v-spacer />
                    <v-text-field
                        v-model="table.search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                        dense
                    />
                </v-card-title>

                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :search="table.search"
                        :items-per-page="-1"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'Processes',
    components: {},
    data() {
        return {
            table: {
                headers: null,
                items: null,
                search: ''
            }
        }
    },
    computed: {
        headers() {
            const headers = this.table.headers
            if (!headers || !Array.isArray(headers)) {
                return []
            }
            return headers.map((item) => {
                return {
                    text: item,
                    value: item
                }
            })
        },
        items() {
            const items = this.table.items
            const headers = this.table.headers
            if (!items || !Array.isArray(items)) {
                return []
            }
            return items.map((item) => {
                if (!item || !Array.isArray(item)) {
                    return []
                }
                const result = {}
                item.forEach((value, index) => {
                    result[headers[index]] = value
                })
                return result
            })
        }
    },
    created() {
        // Dev: Test data
        if (process.env.dev) {
            this.table.headers = ['PID', 'USER', 'PR', 'NI', 'VIRT', 'RES', 'SHR', 'S', '%CPU', '%MEM', 'TIME+', 'COMMAND']
            this.table.items = [
                ['782', 'pihole', '10', '-10', '296572', '221584', '25428', 'R', '52,9', '2,8', '1171:06', 'pihole-FTL'],
                ['13724', 'pi', '20', '0', '10296', '2920', '2508', 'R', '11,8', '0,0', '0:00.04', 'top'],
                ['27819', 'root', '0', '-20', '0', '0', '0', 'I', '5,9', '0,0', '0:36.26', 'kworker/2+'],
                ['1', 'root', '20', '0', '34864', '8248', '6348', 'S', '0,0', '0,1', '2:14.98', 'systemd'],
                ['2', 'root', '20', '0', '0', '0', '0', 'S', '0,0', '0,0', '0:06.72', 'kthreadd'],
                ['3', 'root', '0', '-20', '0', '0', '0', 'I', '0,0', '0,0', '0:00.00', 'rcu_gp'],
                ['4', 'root', '0', '-20', '0', '0', '0', 'I', '0,0', '0,0', '0:00.00', 'rcu_par_gp']
            ]
        }
    },
    activated() {
        // Socket.IO: Joining room
        this.$socket.emit('room:join', 'processesRoom')
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.$socket.emit('room:leave', 'processesRoom')
    },
    sockets: {
        processes(message) {
            if (message._status === 'error') {
                console.error('[Socket.io] -> Message from server \'processes\':', message)
                return false
            }

            // Saving socket data
            console.log('[Socket.io] -> Message from server \'processes\':', message)
            this.table.headers = message.data.columns
            this.table.items = message.data.processes
        }
    },
    methods: {
    }
}
</script>

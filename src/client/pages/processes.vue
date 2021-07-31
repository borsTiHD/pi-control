<template>
    <v-row justify="center">
        <v-col class="d-flex flex-column">
            <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
                <v-card-title class="headline">
                    <v-icon
                        large
                        color="primary"
                        class="mr-2"
                    >
                        mdi-chip
                    </v-icon>
                    Processes

                    <v-tooltip right>
                        <template #activator="{ on, attrs }">
                            <div class="d-inline-block ml-4" v-bind="attrs" v-on="on">
                                <v-switch
                                    v-model="autoRefresh"
                                    @change="refreshSwitch"
                                />
                            </div>
                        </template>
                        <span>{{ autoRefresh ? 'Autorefresh is activated' : 'Switch for activating autorefresh' }}</span>
                    </v-tooltip>

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
                        :headers="table.headers"
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
import Process from '@/models/Process'
import { mapGetters } from 'vuex'

export default {
    name: 'Processes',
    components: {},
    data() {
        return {
            table: {
                headers: [
                    {
                        text: 'PID',
                        value: 'pid'
                    },
                    {
                        text: 'USER',
                        value: 'user'
                    },
                    {
                        text: 'PR',
                        value: 'pr'
                    },
                    {
                        text: 'NI',
                        value: 'ni'
                    },
                    {
                        text: 'VIRT',
                        value: 'virt'
                    },
                    {
                        text: 'RES',
                        value: 'res'
                    },
                    {
                        text: 'SHR',
                        value: 'shr'
                    },
                    {
                        text: 'S',
                        value: 's'
                    },
                    {
                        text: '%CPU',
                        value: 'cpu'
                    },
                    {
                        text: '%MEM',
                        value: 'mem'
                    },
                    {
                        text: 'TIME+',
                        value: 'time'
                    },
                    {
                        text: 'COMMAND',
                        value: 'command'
                    }
                ],
                search: ''
            },
            autoRefresh: true
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        items() {
            return Process.query()
                .orderBy('id', 'desc')
                .get()
        }
    },
    created() {
        // Dev: Test data
        if (this.$config.TEST_DATA) {
            const headers = this.table.headers
            const rawData = [
                ['782', 'pihole', '10', '-10', '296572', '221584', '25428', 'R', '52,9', '2,8', '1171:06', 'pihole-FTL'],
                ['13724', 'pi', '20', '0', '10296', '2920', '2508', 'R', '11,8', '0,0', '0:00.04', 'top'],
                ['27819', 'root', '0', '-20', '0', '0', '0', 'I', '5,9', '0,0', '0:36.26', 'kworker/2+'],
                ['1', 'root', '20', '0', '34864', '8248', '6348', 'S', '0,0', '0,1', '2:14.98', 'systemd'],
                ['2', 'root', '20', '0', '0', '0', '0', 'S', '0,0', '0,0', '0:06.72', 'kthreadd'],
                ['3', 'root', '0', '-20', '0', '0', '0', 'I', '0,0', '0,0', '0:00.00', 'rcu_gp'],
                ['4', 'root', '0', '-20', '0', '0', '0', 'I', '0,0', '0,0', '0:00.00', 'rcu_par_gp']
            ]

            // Adding Testdata to database
            Process.create({
                data: rawData.map((row) => {
                    if (!row || !Array.isArray(row)) {
                        return []
                    }
                    const result = {}
                    row.forEach((value, index) => {
                        result[headers[index].value] = value
                    })
                    return result
                })
            })
        }
    },
    activated() {
        // Socket.IO: Joining room - only if autoRefresh is on
        if (this.autoRefresh) { this.socketListening(true) }
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false)
    },
    sockets: {
        processes(message) {
            if (message._status === 'error') {
                console.error('[Socket.io] -> Message from server \'processes\':', message)
                return false
            }

            // Saving socket data
            console.log('[Socket.io] -> Message from server \'processes\':', message)
            const headers = this.table.headers // message.data.columns
            const rawItems = message.data.processes

            // Replacing database witzh new data
            Process.create({
                data: rawItems.filter((row) => {
                    if (!row || !Array.isArray(row)) {
                        console.log('[Process] -> Item is invalid and will be removed:', row)
                        return false // skip
                    } else if (row.length !== 12) {
                        console.log('[Process] -> Item has invalid length and will be removed:', row)
                        return false // skip
                    }
                    return true
                }).map((row) => {
                    // Converts array into an object and adds headers
                    const result = {}
                    row.forEach((value, index) => {
                        const key = headers[index].value // Getting key from headers
                        result[key] = value // Create key on object with value from array
                    })
                    return result
                })
            })
        }
    },
    methods: {
        socketListening(state) {
            if (state) {
                // Socket.IO: Joining room
                this.$socket.emit('room:join', 'processesRoom')
            } else {
                // Socket.IO: Leaving room
                this.$socket.emit('room:leave', 'processesRoom')
            }
        },
        refreshSwitch(event) {
            if (this.autoRefresh) {
                // Socket.IO: Joining room
                this.socketListening(true)
            } else {
                // Socket.IO: Leaving room
                this.socketListening(false)
            }
        }
    }
}
</script>

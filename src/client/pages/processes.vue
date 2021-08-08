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
                        {{ $icons.mdiChip }}
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
                        :append-icon="$icons.mdiMagnify"
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
                        :loading="loading"
                    >
                        <template v-for="h in headers" #[`header.${h.value}`]="{ header }">
                            <v-tooltip :key="h.value" bottom>
                                <template #activator="{ on }">
                                    <span v-on="on">{{ header.text }}</span>
                                </template>
                                <span>{{ header.tooltip }}</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
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
            isWin: false,
            table: {
                search: '',
                headersNonWin: [
                    {
                        text: 'PID',
                        value: 'pid',
                        tooltip: 'This is the process ID.'
                    },
                    {
                        text: 'PPID',
                        value: 'ppid',
                        tooltip: 'This is the parent process ID.'
                    },
                    {
                        text: 'UID',
                        value: 'uid',
                        tooltip: 'User ID'
                    },
                    {
                        text: 'USER',
                        value: 'user',
                        tooltip: 'This is the "effective" username who started the process.'
                    },
                    {
                        text: '%CPU',
                        value: 'cpu',
                        tooltip: 'Shows the current CPU utilization in percent.'
                    },
                    {
                        text: '%MEM',
                        value: 'memory',
                        tooltip: 'Shows used RAM as a percentage of the total RAM available.'
                    },
                    {
                        text: 'TIME',
                        value: 'time',
                        tooltip: 'This is the total CPU time used by the process.'
                    },
                    {
                        text: 'NAME',
                        value: 'name',
                        tooltip: 'Shows the name of the process.'
                    },
                    {
                        text: 'COMMAND',
                        value: 'cmd',
                        tooltip: 'Shows the complete name with argument and path.'
                    }
                ],
                headersWin: [
                    {
                        text: 'PID',
                        value: 'pid',
                        tooltip: 'This is the process ID.'
                    },
                    {
                        text: 'Handles',
                        value: 'handles',
                        tooltip: 'The number of handles that the process has opened.'
                    },
                    {
                        text: 'CPU(s)',
                        value: 'cpu',
                        tooltip: 'The amount of processor time that the process has used on all processors, in seconds.'
                    },
                    {
                        text: 'NPM(K)',
                        value: 'npm',
                        tooltip: 'The amount of non-paged memory that the process is using, in kilobytes.'
                    },
                    {
                        text: 'PM(K)',
                        value: 'pm',
                        tooltip: 'The amount of pageable memory that the process is using, in kilobytes.'
                    },
                    {
                        text: 'WS(K)',
                        value: 'ws',
                        tooltip: 'The size of the working set of the process, in kilobytes. The working set consists of the pages of memory that were recently referenced by the process.'
                    },
                    {
                        text: 'SI',
                        value: 'si',
                        tooltip: ''
                    },
                    {
                        text: 'NAME',
                        value: 'name',
                        tooltip: 'Shows the name of the process.'
                    }
                ]
            },
            loading: false,
            autoRefresh: true,
            socketRoom: 'processes'
        }
    },
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
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
        },
        headers() {
            if (this.isWin) {
                return this.table.headersWin
            }
            return this.table.headersNonWin
        }
    },
    created() {
        // Set loading
        this.loading = true
    },
    activated() {
        // Socket.IO: Joining room - only if autoRefresh is on
        if (this.autoRefresh) { this.socketListening(true, this.socketRoom) }
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false, this.socketRoom)
    },
    sockets: {
        processes(message) {
            if (message._status === 'error') {
                console.error(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                // Set loading to 'false' after we get an error
                this.loading = false
                return false
            } else if (message._status === 'ok') {
                // Saving socket data
                // console.log(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                const processes = message.data.processes
                this.isWin = message?.data?.isWin

                // Replacing database with new data
                Process.create({
                    data: processes
                })
            } else {
                console.log(`[Socket.io] -> Message from server '${this.socketRoom}', without usable data:`, message)
            }

            // Set loading to 'false' after we get data
            this.loading = false
        }
    },
    methods: {
        refreshSwitch(event) {
            if (this.autoRefresh) {
                // Socket.IO: Joining room
                this.socketListening(true, this.socketRoom)
            } else {
                // Socket.IO: Leaving room
                this.socketListening(false, this.socketRoom)
            }
        }
    }
}
</script>

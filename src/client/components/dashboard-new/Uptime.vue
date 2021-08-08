<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column mt-2">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiClockOutline }}
            </v-icon>
            Uptime
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading && !systemStartTime">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else-if="systemStartTime">
                <v-col cols="12" class="d-flex flex-column">
                    <span>
                        <span class="text-subtitle-1">Boot Time:</span>
                        <span class="ml-2">{{ systemStartTime }}</span>
                    </span>
                    <span v-if="uptimeText">
                        <span class="text-subtitle-1">Uptime:</span>
                        <span class="ml-2">{{ uptimeText }}</span>
                    </span>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-alert
                        text
                        prominent
                        type="error"
                        :icon="$icons.mdiCloudAlert"
                    >
                        {{ textNoData }}
                    </v-alert>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import moment from 'moment'
import Uptime from '@/models/Uptime'
import { mapGetters } from 'vuex'

export default {
    name: 'Uptime',
    data() {
        return {
            loading: false,
            uptimeInterval: null,
            uptimeText: null,
            socketRoom: 'uptime',
            textNoData: 'No data could be determined.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        systemStartTime() {
            const uptime = Uptime.query()
                .orderBy('id', 'desc')
                .get()
            return uptime[0]?.uptime
        }
    },
    created() {
        // Set loading
        this.loading = true
    },
    activated() {
        // Socket.IO: Joining room
        this.loading = true // Set loading to true after the app joins the room
        this.socketListening(true, this.socketRoom)

        // Creates interval for uptdating uptime text
        this.uptimeInterval = setInterval(() => {
            const duration = this.durationHumanize()
            this.uptimeText = duration
        }, 1000 * 10)
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false, this.socketRoom)

        // Clear component interval
        clearInterval(this.uptimeInterval)
    },
    sockets: {
        uptime(message) {
            if (message._status === 'error') {
                console.error(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                // Set loading to 'false' after we get an error
                this.loading = false
                return false
            } else if (message._status === 'ok') {
                // Saving socket data
                // console.log(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                const uptime = message.data.uptime

                // Replacing database with new data
                Uptime.create({
                    data: { uptime }
                })

                const duration = this.durationHumanize()
                this.uptimeText = duration
            } else {
                console.log(`[Socket.io] -> Message from server '${this.socketRoom}', without usable data:`, message)
            }

            // Set loading to 'false' after we get data
            this.loading = false
        }
    },
    methods: {
        getDuration(time) {
            const duration = moment.duration(moment().diff(time))
            const durationObj = {
                milliseconds: duration.milliseconds(),
                seconds: duration.seconds(),
                minutes: duration.minutes(),
                hours: duration.hours(),
                days: duration.days(),
                // weeks: Number.parseInt(duration.asWeeks(), 10) // duration.weeks(),
                months: Number.parseInt(duration.asMonths(), 10) // duration.months(),
                // years: duration.years()
            }
            return durationObj
        },
        durationHumanize() {
            const duration = this.getDuration(this.systemStartTime)
            let text = ''

            // Check times
            // if (duration?.years) { text += ` ${duration.years} years,` }
            if (duration?.months) { text += ` ${duration.months} months,` }
            // if (duration?.weeks) { text += ` ${duration.weeks} weeks,` }
            if (duration?.days) { text += ` ${duration.days} days,` }
            if (duration?.hours) { text += ` ${duration.hours} hours,` }
            if (duration?.minutes) { text += ` ${duration.minutes} minutes,` }
            // if (duration?.seconds) { text += ` ${duration.seconds} seconds,` }

            return text.trim().slice(0, -1)
        }
    }
}
</script>

<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiClockOutline }}
            </v-icon>
            Uptime
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <div class="d-inline-block" v-bind="attrs" v-on="on">
                        <v-btn
                            icon
                            color="primary"
                            class="ml-2"
                            :loading="loading"
                            :disabled="loading"
                            @click="getUptime"
                        >
                            <v-icon>{{ $icons.mdiCached }}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>Rescan</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else-if="systemStartTime" dense>
                <v-col cols="12">
                    <v-list-item dense two-line>
                        <v-list-item-content>
                            <v-list-item-title>
                                Boot Time:
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <v-badge dot inline left /> {{ systemStartTime }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="uptimeText" dense two-line>
                        <v-list-item-content>
                            <v-list-item-title>
                                Uptime:
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <v-badge dot inline left /> {{ uptimeText }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
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
import Device from '@/models/Device'
import { mapGetters } from 'vuex'

export default {
    name: 'Uptime',
    data() {
        return {
            loading: false,
            uptimeInterval: null,
            uptimeText: null,
            textNoData: 'No data could be determined.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getCurrentDeviceId: 'device/getCurrentDeviceId'
        }),
        systemStartTime() {
            return false
            /*
            const uptime = Uptime.query()
                .orderBy('id', 'desc')
                // .whereId(this.todoId)
                .get()
            return uptime[0]?.uptime
            */
        }
    },
    created() {
        // Getting Data
        this.getUptime()
    },
    activated() {
        // Creates interval for uptdating uptime text
        this.durationHumanize()
        this.uptimeInterval = setInterval(() => {
            this.durationHumanize()
        }, 1000 * 10)
    },
    deactivated() {
        // Clear component interval
        clearInterval(this.uptimeInterval)
    },
    methods: {
        getUptime() {
            const url = '/device/uptime'
            this.loading = true
            this.$axios.get(url)
                .then(async(res) => {
                    const uptime = res.data.data.uptime
                    // console.log('[Uptime] -> Host system uptime:', uptime)

                    // Replacing database with new data
                    const check = await Device.update({
                        where: this.getCurrentDeviceId,
                        data: {
                            id: this.getCurrentDeviceId,
                            uptime: { uptime }
                        }
                    })

                    console.log('check:', check)

                    this.durationHumanize()
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
        },
        getDuration(time) {
            const duration = moment.duration(moment().diff(time))
            const durationObj = {
                // milliseconds: duration.milliseconds(),
                // seconds: duration.seconds(),
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

            const durationText = text.trim().slice(0, -1)
            this.uptimeText = durationText

            return durationText
        }
    }
}
</script>

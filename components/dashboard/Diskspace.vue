<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-micro-sd
            </v-icon>
            Diskspace
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        :loading="loading"
                        :disabled="loading"
                        v-bind="attrs"
                        v-on="on"
                        @click="$emit('rescan')"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
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
            <v-row v-else-if="!loading && data">
                <v-col cols="12">
                    <span class="font-weight-bold">{{ space.disk.mounted }}</span>
                    <span>Used: <span class="font-weight-bold">{{ space.disk.used }}MB ({{ space.disk.usedPercentage }}%)</span></span>
                    <span>Free: <span class="font-weight-bold">{{ space.disk.available }}MB</span></span>
                    <span>Total: <span class="font-weight-bold">{{ space.disk.total }}MB</span></span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="space.disk.usedPercentage"
                        :color="color(space.disk.usedPercentage)"
                        height="25"
                    >
                        <strong>{{ space.disk.usedPercentage }}%</strong>
                    </v-progress-linear>
                </v-col>

                <v-divider class="mx-4" />

                <v-col cols="12">
                    <span class="font-weight-bold">{{ space.boot.mounted }}</span>
                    <span>Used: <span class="font-weight-bold">{{ space.boot.used }}MB ({{ space.boot.usedPercentage }}%)</span></span>
                    <span>Free: <span class="font-weight-bold">{{ space.boot.available }}MB</span></span>
                    <span>Total: <span class="font-weight-bold">{{ space.boot.total }}MB</span></span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="space.boot.usedPercentage"
                        :color="color(space.boot.usedPercentage)"
                        height="25"
                    >
                        <strong>{{ space.boot.usedPercentage }}%</strong>
                    </v-progress-linear>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-alert
                        text
                        prominent
                        type="error"
                        icon="mdi-cloud-alert"
                    >
                        {{ textNoData }}
                    </v-alert>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Diskspace',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            textNoData: 'No data could be determined. Please rescan manually.',
            limits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: 'primary' },
                mid: { value: 50, color: 'yellow' },
                high: { value: 60, color: 'orange' },
                max: { value: 80, color: 'red' }
            }
        }
    },
    computed: {
        ...mapGetters({
            getDiskData: 'device/getDiskData'
        }),
        data() {
            if (this.getDiskData) return this.getDiskData
            return false
        },
        space() {
            if (this.data) {
                const types = this.crawlDiskData(this.data, 0)
                const disk = this.crawlDiskData(this.data, 1)
                const boot = this.crawlDiskData(this.data, 2)

                // Returning Object for better use
                return {
                    types,
                    disk: {
                        filesystem: disk[0], // Filesystem
                        type: disk[1], // Type
                        total: disk[2], // 1M-blocks
                        used: disk[3], // Used
                        available: disk[4], // Available
                        usedPercentage: this.returnPercentageNumber(disk[5]), // Use%
                        mounted: disk[6] // Mounted on
                    },
                    boot: {
                        filesystem: boot[0], // Filesystem
                        type: boot[1], // Type
                        total: boot[2], // 1M-blocks
                        used: boot[3], // Used
                        available: boot[4], // Available
                        usedPercentage: this.returnPercentageNumber(boot[5]), // Use%
                        mounted: boot[6] // Mounted on
                    }
                }
            }
            return false
        }
    },
    methods: {
        crawlDiskData(data, index) {
            // Crawls response from 'fdf -x tmpfs -x devtmpfs -m -Tree'
            // Line 0: Disk types -> English: Filesystem, Type, 1M-blocks, Used, Available, Use%, Mounted on
            // Line 0: Disk types -> German: Dateisystem, Typ, 1M-Blöcke, Benutzt, Verfügbar, Verw%, Eingehängt auf
            // Every line after: Disk data, Boot data
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 0) {
                return arr[index].split(/\s+/)
            }
            return false
        },
        returnPercentageNumber(string) {
            return parseInt(string.replace('%', ''))
        },
        color(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.limits
            if (val >= limit.max.value) {
                return limit.max.color
            } else if (val >= limit.high.value) {
                return limit.high.color
            } else if (val >= limit.mid.value) {
                return limit.mid.color
            } else if (val >= limit.low.value) {
                return limit.low.color
            }
            return 'secondary' // not possible
        }
    }
}
</script>

<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiMicroSd }}
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
                        @click="getData"
                    >
                        <v-icon>{{ $icons.mdiCached }}</v-icon>
                    </v-btn>
                </template>
                <span>Rescan</span>
            </v-tooltip>

            <v-badge
                v-if="testData"
                color="warning"
                content="TEST DATA"
                inline
            />
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
            <div v-else-if="!loading && data">
                <v-row v-for="(space, i) in data" :key="i">
                    <v-col cols="12">
                        <span class="font-weight-bold">{{ space.mounted }}</span>
                        <span>Used: <span class="font-weight-bold">{{ space.used }}MB ({{ space.usedPercentage }}%)</span></span>
                        <span>Free: <span class="font-weight-bold">{{ space.available }}MB</span></span>
                        <span>Total: <span class="font-weight-bold">{{ space.total }}MB</span></span>
                    </v-col>
                    <v-col cols="12">
                        <v-progress-linear
                            :value="space.usedPercentage"
                            :color="color(space.usedPercentage)"
                            height="25"
                        >
                            <strong>{{ space.usedPercentage }}%</strong>
                        </v-progress-linear>
                    </v-col>

                    <!-- Line on every Item, except the last one -->
                    <v-divider v-if="data.length !== i+1" class="mx-4" />
                </v-row>
            </div>
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
import { mapGetters } from 'vuex'
import Diskspace from '@/models/Diskspace'

export default {
    name: 'Diskspace',
    data() {
        return {
            loading: false,
            testData: false,
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
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        data() {
            return Diskspace.query().get() || false
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            const url = '/device/diskspace'
            this.loading = true
            this.$axios.get(url)
                .then((res) => {
                    // TEST DATA - are not real
                    if (res?.data?.TEST_DATA) {
                        this.testData = true
                    }

                    // Replacing database with new data
                    const data = res?.data?.data
                    Diskspace.create({
                        data
                    })
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
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

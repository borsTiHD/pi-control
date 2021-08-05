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
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <div class="d-inline-block" v-bind="attrs" v-on="on">
                        <v-btn
                            icon
                            color="primary"
                            class="ml-2"
                            :loading="loading"
                            :disabled="loading || getAutoRefresh"
                            @click="$emit('rescan')"
                        >
                            <v-icon>{{ $icons.mdiCached }}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{ getAutoRefresh ? 'Autorefresh is activated' : 'Rescan' }}</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading && !data">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else-if="data">
                <v-col cols="12">
                    {{ data }}
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
import { mapGetters } from 'vuex'

export default {
    name: 'Uptime',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            textNoData: 'No data could be determined. Please rescan manually.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getAutoRefresh: 'settings/getAutoRefresh',
            getUptimeData: 'device/getUptimeData'
        }),
        data() {
            if (this.getUptimeData) return this.getUptimeData
            return false
        }
    }
}
</script>

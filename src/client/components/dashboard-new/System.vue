<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiLaptop }}
            </v-icon>
            System
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
            <v-row v-else-if="!loading && items.length > 0">
                <v-col cols="12">
                    <v-simple-table dense>
                        <template #default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Name
                                    </th>
                                    <th class="text-left">
                                        State
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in items"
                                    :key="item.name"
                                >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.state }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
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
import System from '@/models/System'
import { mapGetters } from 'vuex'

export default {
    name: 'System',
    data() {
        return {
            loading: false,
            testData: false,
            textNoData: 'No data could be determined.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        items() {
            return System.query().get()
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            const url = '/device/system'
            this.loading = true
            this.$axios.get(url)
                .then((res) => {
                    // TEST DATA - are not real
                    if (res?.data?.TEST_DATA) {
                        this.testData = true
                    }

                    // Replacing database with new data
                    const data = res?.data?.data
                    System.create({
                        data
                    })
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>

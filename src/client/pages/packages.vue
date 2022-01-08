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
                        {{ $icons.mdiPackageVariantClosed }}
                    </v-icon>
                    Packages

                    <v-tooltip right>
                        <template #activator="{ on, attrs }">
                            <div class="d-inline-block" v-bind="attrs" v-on="on">
                                <v-btn
                                    icon
                                    color="primary"
                                    class="ml-2"
                                    :loading="loading"
                                    :disabled="loading"
                                    @click="getData"
                                >
                                    <v-icon>{{ $icons.mdiCached }}</v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <span>Rescan</span>
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
import { mapGetters } from 'vuex'
import Package from '@/models/Package'

export default {
    name: 'PackagesPage',
    components: {},
    data() {
        return {
            isWin: false,
            loading: false,
            table: {
                search: '',
                headers: [
                    {
                        text: 'Name',
                        value: 'name',
                        tooltip: 'xxx'
                    },
                    {
                        text: 'Version',
                        value: 'version',
                        tooltip: 'xxx'
                    },
                    {
                        text: 'Installed',
                        value: 'installed',
                        tooltip: 'xxx'
                    }
                ]
            }
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
            return Package.query()
                .orderBy('id', 'asc')
                .get()
        },
        headers() {
            return this.table.headers
        }
    },
    created() {
        // Getting Data
        this.getData()
    },
    methods: {
        getData() {
            const url = '/package/list'
            this.loading = true
            this.$axios.get(url)
                .then(async(res) => {
                    const packages = res.data?.data?.packages
                    // console.log('[Packages] -> Host system installed packages:', packages)
                    this.isWin = res.data?.data?.isWin
                    // TODO - needs to be in a relationship with DEVICE!!!:
                    // Replacing database with new data
                    await Package.create({
                        data: packages
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

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
                    <app-button
                        name="Check Updates"
                        tooltip="Updates package list"
                        btn-color="primary"
                        small
                        :loading="loading"
                        :disabled="loading"
                        @click="updateList"
                    />
                </v-card-title>
                <v-divider class="mx-4" />
                <v-card-text class="d-flex">
                    <display-amount :value="items.length" active-color="success" :icon="$icons.mdiPackageVariantClosed" tooltip="Show all installed packages" @clicked="showUpgradable = false" />
                    <display-amount :value="upgradableItems.length" active-color="info" :icon="$icons.mdiPackageUp" tooltip="Show only upgradable packages" @clicked="showUpgradable = true" />
                    <v-spacer />
                    <v-text-field
                        v-model="table.search"
                        :append-icon="$icons.mdiMagnify"
                        label="Search"
                        single-line
                        hide-details
                        dense
                    />
                </v-card-text>
                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="showUpgradable ? upgradableItems : items"
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
import AppButton from '@/components/Button.vue'
import DisplayAmount from '~/components/display/DisplayAmount.vue'

export default {
    name: 'PackagesPage',
    components: {
        AppButton,
        DisplayAmount
    },
    data() {
        return {
            isWin: false,
            loading: false,
            showUpgradable: false,
            table: {
                search: '',
                headers: [
                    {
                        text: 'Name',
                        value: 'name',
                        tooltip: 'Name of the package'
                    },
                    {
                        text: 'Version',
                        value: 'version',
                        tooltip: 'Version and operating system architecture of the package'
                    },
                    {
                        text: 'Status',
                        value: 'installed',
                        tooltip: 'Status of the package'
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
        upgradableItems() {
            const items = this.items
            return items.filter((item) => {
                const regExp = /.*(upgradable|aktualisierbar).*/mi
                return regExp.test(item.installed)
            })
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
        async getData() {
            const url = '/package/list'
            this.loading = true
            return this.$axios.get(url)
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
        },
        updateList() {
            const url = '/package/updatelist'
            this.loading = true
            this.$axios.get(url)
                .then(async(res) => {
                    if (res.data?._status === 'ok') {
                        // Get new package list
                        await this.getData()
                        this.$toast.info(res.data?.info)
                    }
                }).catch((error) => {
                    console.error(error)
                    this.$toast.error('Error on updating package list')
                }).finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>

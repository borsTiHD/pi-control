<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline pa-2">Design</v-card-title>
        <v-card-actions>
            <v-row dense justify="space-between">
                <v-col cols="6">
                    <v-select
                        :items="themes"
                        :value="getActiveSkin"
                        label="Select Theme"
                        hide-details="auto"
                        outlined
                        dense
                        @input="updateTheme"
                    />
                </v-col>
                <v-col cols="6" class="d-flex">
                    <app-button
                        v-if="getActiveSkin === 'Custom'"
                        name="Edit"
                        tooltip="Customize your own theme"
                        btn-color="primary"
                        btn-class="mt-1 ml-6"
                        small
                        @click="showCustomDesign = true"
                    />
                    <app-custom-design v-model="showCustomDesign" />
                </v-col>
                <v-col cols="6" class="d-flex">
                    <v-switch
                        :value="darkMode"
                        :input-value="darkMode"
                        :label="darkMode ? 'Dark Theme' : 'Light Theme'"
                        hide-details="auto"
                        dense
                        @change="updateDarkMode($event !== null, $event)"
                    />
                </v-col>
                <v-col cols="6" class="d-flex">
                    <v-switch
                        :value="getOutlined"
                        :input-value="getOutlined"
                        label="Card Border"
                        hide-details="auto"
                        dense
                        @change="updateOutlined($event !== null, $event)"
                    />
                </v-col>
                <v-divider class="mt-6 mx-4 mb-3" />
                <v-col cols="12">
                    <v-slider
                        :value="getElevation"
                        label="Card Shadow"
                        thumb-color="primary"
                        thumb-label
                        hint="Determines the shadow strength of all elements"
                        persistent-hint
                        min="0"
                        max="24"
                        @change="setElevation"
                    >
                        <template #prepend>
                            <v-icon
                                color="primary"
                                @click="decElevation"
                            >
                                {{ $icons.mdiMinus }}
                            </v-icon>
                        </template>

                        <template #append>
                            <v-icon
                                color="primary"
                                @click="incElevation"
                            >
                                {{ $icons.mdiPlus }}
                            </v-icon>
                        </template>
                    </v-slider>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import Themes from '@/plugins/themes.js'
import AppCustomDesign from '@/components/modal/CustomDesign.vue'
import AppButton from '@/components/Button.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'Design',
    components: {
        AppCustomDesign,
        AppButton
    },
    data: () => ({
        themes: null,
        showCustomDesign: false
    }),
    computed: {
        ...mapGetters({
            getActiveSkin: 'settings/getActiveSkin',
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        darkMode() {
            return this.$vuetify.theme.dark
        }
    },
    created() {
        // Loading all existing theme names ['Default', 'Blue']
        const themeNames = Themes.map((theme) => theme.name)
        this.themes = themeNames
    },
    methods: {
        ...mapActions({
            setActiveSkin: 'settings/setActiveSkin',
            setDarkMode: 'settings/setDarkMode',
            setElevation: 'settings/setElevation',
            setOutlined: 'settings/setOutlined'
        }),
        updateTheme(themeName) {
            this.setActiveSkin(themeName) // Set Vuex Store
            this.$design.changeTheme(themeName) // Changing theme with plugin
        },
        updateDarkMode(value, event) {
            const newMode = !this.darkMode
            this.setDarkMode(newMode) // Set Vuex Store
            this.$vuetify.theme.dark = newMode
        },
        updateOutlined(value, event) {
            this.setOutlined(value) // Set Vuex Store
        },
        decElevation() {
            // Decreasing Elevation
            const newVal = this.getElevation - 1
            if (newVal >= 0) {
                this.setElevation(newVal)
            }
        },
        incElevation() {
            // Increasing Elevation
            const newVal = this.getElevation + 1
            if (newVal <= 24) {
                this.setElevation(newVal)
            }
        }
    }
}
</script>

<style scoped>
</style>

<template>
    <v-dialog
        v-model="show"
        max-width="600px"
    >
        <v-card :elevation="getElevation" :outlined="getOutlined">
            <v-card-title>Custom Design:</v-card-title>
            <v-divider />
            <v-card-text>
                <v-container>
                    <div v-for="(theme, themeName, index) in getCustomTheme" :key="index">
                        <v-row v-if="themeName === mode" dense>
                            <v-col v-for="(style, name, i) in theme" :key="i" cols="6" class="flex d-flex flex-row">
                                <v-menu
                                    v-model="menus[themeName][name]"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                                >
                                    <template #activator="{ on }">
                                        <!-- Text shows the color code and activates the color picker -->
                                        <v-text-field
                                            :label="name"
                                            append-icon="mdi-format-color-fill"
                                            :value="style"
                                            readonly
                                            v-on="on"
                                        />
                                        <!-- Small color box that displays the selected color -->
                                        <v-sheet
                                            class="ml-2 mr-6 align-self-center"
                                            :color="style"
                                            rounded
                                            elevation="3"
                                            height="20"
                                            width="50"
                                        />
                                    </template>
                                    <v-color-picker
                                        :value="style"
                                        dot-size="25"
                                        mode="hexa"
                                        show-swatches
                                        hide-mode-switch
                                        swatches-max-height="200"
                                        @input="colorChange($event, themeName, name)"
                                    />
                                </v-menu>
                            </v-col>
                        </v-row>
                    </div>
                </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn color="info" text @click="resetTheme">Default</v-btn>
                <v-btn color="seconary" text @click.stop="show = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Themes from '@/plugins/themes.js'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'CustomDesign',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        menus: {},
        defaultThemeName: 'Default'
    }),
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getCustomTheme: 'settings/getCustomTheme'
        }),
        darkMode() {
            return this.$vuetify.theme.dark
        },
        show: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        },
        mode() {
            // Converts darkMode to text so that it can be compared in the loop
            // This will only list Light or Dark Theme... depending on what is currently active
            return this.darkMode ? 'dark' : 'light'
        }
    },
    created() {
        let customTheme = this.getCustomTheme

        // If the saved custom theme is empty (e.g. when using the app for the first time), default values are loaded.
        if (Object.keys(customTheme).length === 0 && customTheme.constructor === Object) {
            const defaultTheme = Themes.find(({ name }) => name === this.defaultThemeName) // Default Theme
            this.setCustomTheme(defaultTheme.theme) // Saves Custom Theme in Store
            // this.$design.changeTheme('Custom') // Changing Theme for changes to take effect
            customTheme = defaultTheme.theme // Sets theme object for further initialization of the component
        }

        // Creates an object for each menu from Custom Theme
        // Default value 'false', so that the menu is closed
        // Is needed for opening the color palettes / color picker
        for (const themeName in customTheme) {
            if (Object.hasOwnProperty.call(customTheme, themeName)) {
                const theme = customTheme[themeName]
                this.menus[themeName] = {}
                for (const key in theme) {
                    if (Object.hasOwnProperty.call(theme, key)) {
                        this.$set(this.menus[themeName], key, false)
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions({
            setCustomTheme: 'settings/setCustomTheme'
        }),
        deepObjCopy(obj) {
            // Deep clones an object
            return JSON.parse(JSON.stringify(obj))
        },
        resetTheme() {
            // Determines default theme object
            const defaultTheme = Themes.find(({ name }) => name === this.defaultThemeName)

            // Changes color and saves changed object in store
            this.setCustomTheme(defaultTheme.theme)

            // Changes theme, so that changes become effective
            this.$design.changeTheme('Custom')
        },
        colorChange(color, themeName, name) {
            // Fetches complete custom theme object - deep copy so we have a fresh object WITHOUT reference to the old one
            const customTheme = this.deepObjCopy(this.getCustomTheme)

            // Changes color and saves changed object in store
            customTheme[themeName][name] = color
            this.setCustomTheme(customTheme)

            // Changes theme, so that changes become effective
            this.$design.changeTheme('Custom')
        }
    }
}
</script>

<style scoped>
</style>

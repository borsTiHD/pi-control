import Themes from '@/plugins/themes.js'

export default ({ app }, inject) => {
    // Plugin Functions
    const design = {
        // Change the theme
        changeTheme: (themeName) => {
            try {
                // If no name was passed, we use 'Default'
                if (!themeName) themeName = 'Default'

                // The theme object will be overwritten
                let themeObj = null

                // Themes: Fetches the data from the plugin
                // 'Custom': Fetches from the stored user data
                if (themeName === 'Custom') {
                    const customTheme = app.store.getters['settings/getCustomTheme']
                    themeObj = {
                        theme: customTheme
                    }
                } else {
                    themeObj = Themes.find(({ name }) => name === themeName)
                }

                if (themeObj) {
                    // Updating Theme - funktioniert nur wenn Light/Dark Themeobjekte einzeln/nacheinander ersetzt werden -> darum der Loop
                    for (const [key, value] of Object.entries(themeObj?.theme)) {
                        app.context.$vuetify.theme.themes[key] = value
                    }
                } else {
                    throw new Error('No Theme could be set.')
                }
            } catch (error) {
                console.error('[ChangeTheme] -> Error:', error)
            }
        }
    }

    // Inject $design in Vue, context and store
    inject('design', design)
}

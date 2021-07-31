// Check: https://web.dev/customize-install/
export default ({ app }, inject) => {
    // Window Listener for installable event
    function initInstallableListener(pwa) {
        // Window Listener -> Event is triggered when the app can be installed
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault() // Prevent the mini-infobar from appearing on mobile
            pwa.deferredPrompt = e // Stash the event so it can be triggered later
            pwa.showInstallPromotion() // Update UI notify the user they can install the PWA
            console.log('[PWA] -> "beforeinstallprompt" event was fired.')
        })
    }

    // Window Listener for installed event
    function initInstalledListener(pwa) {
        window.addEventListener('appinstalled', () => {
            pwa.installed = true // App is installed
            pwa.hideInstallPromotion() // Hide the app-provided install promotion
            pwa.deferredPrompt = null // Clear the deferredPrompt so it can be garbage collected
            console.log('[PWA] -> App was installed.')
        })
    }

    // Plugin object
    const pwa = {
        deferredPrompt: null, // Initialize deferredPrompt
        installable: false, // Check to show browser install prompt
        installed: false, // Check if 'pwa' is installed
        async install() {
            // Hide the possibility to install app
            this.hideInstallPromotion()

            // Checks if install prompt is saved from the event listener
            if (this.deferredPrompt) {
                // Show the install prompt
                this.deferredPrompt.prompt()

                // Wait for the user to respond to the prompt
                const { outcome } = await this.deferredPrompt.userChoice
                console.log(`[PWA] -> User response to the install prompt: ${outcome}`)

                // We've used the prompt, and can't use it again, throw it away
                this.deferredPrompt = null

                // Init Listener again
                initInstallableListener(this)
                return true
            } else {
                console.error('[PWA] -> Install prompt did not exist.')
                throw new Error('App could not be installed.')
            }
        },
        showInstallPromotion() {
            this.installable = true
        },
        hideInstallPromotion() {
            this.installable = false
        },
        getPWADisplayMode() {
            // Track how the PWA was launched - https://web.dev/customize-install/#track-how-the-pwa-was-launched
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            if (document.referrer.startsWith('android-app://')) {
                return 'twa'
            } else if (navigator.standalone || isStandalone) {
                return 'standalone'
            }
            return 'browser'
        }
    }

    // Init Event Listener
    initInstallableListener(pwa)
    initInstalledListener(pwa)

    // Inject $pwa in Vue, context and store
    inject('pwa', pwa)
}

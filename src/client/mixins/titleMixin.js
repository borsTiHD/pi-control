import pkg from 'projRoot/package.json'

export default {
    methods: {
        headTitle() {
            // Webpage title
            const headTitle = this.$config.dev ? `${pkg.productName.replace(' 🥷', '')} - DEV` : pkg.productName.replace(' 🥷', '')
            return headTitle
        }
    }
}

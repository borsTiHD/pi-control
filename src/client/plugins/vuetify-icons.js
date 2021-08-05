import {
    mdiLan,
    mdiInformation,
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiCloseCircleOutline,
    mdiCloseCircle,
    mdiClose
} from '@mdi/js'

const MY_ICONS = {
    mdiLan,
    mdiInformation,
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiCloseCircleOutline,
    mdiCloseCircle,
    mdiClose
}

export default ({ app }, inject) => {
    // Inject $icons in Vue, context and store
    inject('icons', MY_ICONS)
}

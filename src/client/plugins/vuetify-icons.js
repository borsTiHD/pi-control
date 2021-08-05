import {
    mdiConsole,
    mdiMonitorDashboard,
    mdiCarCruiseControl,
    mdiScriptTextOutline,
    mdiInformationOutline,
    mdiAccountPlus,
    mdiAccountCheck,
    mdiAccountOutline,
    mdiAccountArrowLeft,
    mdiWeatherSunny,
    mdiWeatherNight,
    mdiThemeLightDark,
    mdiCogs,
    mdiMenu,
    mdiBottleTonicSkullOutline,
    mdiSwapHorizontalBold,
    mdiClose,
    mdiCloseCircleOutline,
    mdiClockOutline,
    mdiCloudDownloadOutline,
    mdiFolder,
    mdiFolderPlusOutline,
    mdiFolderEditOutline,
    mdiFileOutline,
    mdiFilePlusOutline,
    mdiFileEditOutline,
    mdiTrashCanOutline,
    mdiShieldLockOutline,
    mdiPlayNetworkOutline,
    mdiFormatColorFill,
    mdiDotsHorizontal,
    mdiLockOutline,
    mdiMagnify,
    mdiMicroSd,
    mdiMemory,
    mdiRaspberryPi,
    mdiThermometer,
    mdiLaptop,
    mdiMinus,
    mdiPlus,
    mdiSchool,
    mdiChip,
    mdiCached,
    mdiServerPlus,
    mdiCloudAlert,
    mdiCircleSmall,
    mdiCodeTags,
    mdiHeart,
    mdiGithub
} from '@mdi/js'

const MY_ICONS = {
    mdiConsole,
    mdiMonitorDashboard,
    mdiCarCruiseControl,
    mdiScriptTextOutline,
    mdiInformationOutline,
    mdiAccountPlus,
    mdiAccountCheck,
    mdiAccountOutline,
    mdiAccountArrowLeft,
    mdiWeatherSunny,
    mdiWeatherNight,
    mdiThemeLightDark,
    mdiCogs,
    mdiMenu,
    mdiBottleTonicSkullOutline,
    mdiSwapHorizontalBold,
    mdiClose,
    mdiCloseCircleOutline,
    mdiClockOutline,
    mdiCloudDownloadOutline,
    mdiFolder,
    mdiFolderPlusOutline,
    mdiFolderEditOutline,
    mdiFileOutline,
    mdiFilePlusOutline,
    mdiFileEditOutline,
    mdiTrashCanOutline,
    mdiShieldLockOutline,
    mdiPlayNetworkOutline,
    mdiFormatColorFill,
    mdiDotsHorizontal,
    mdiLockOutline,
    mdiMagnify,
    mdiMicroSd,
    mdiMemory,
    mdiRaspberryPi,
    mdiThermometer,
    mdiLaptop,
    mdiMinus,
    mdiPlus,
    mdiSchool,
    mdiChip,
    mdiCached,
    mdiServerPlus,
    mdiCloudAlert,
    mdiCircleSmall,
    mdiCodeTags,
    mdiHeart,
    mdiGithub
}

export default ({ app }, inject) => {
    // Inject $icons in Vue, context and store
    inject('icons', MY_ICONS)
}

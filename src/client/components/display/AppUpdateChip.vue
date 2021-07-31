<template>
    <v-tooltip v-if="isNewRelease" left>
        <template #activator="{ on, attrs }">
            <v-chip
                class="mr-2"
                color="error"
                bordered
                small
                v-bind="attrs"
                v-on="on"
                @click="goToNewRelease"
            >
                Update
            </v-chip>
        </template>
        <span>Update available</span>
    </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'AppUpdateChip',
    data() {
        return {
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            isNewRelease: 'isNewRelease',
            getReleaseData: 'getReleaseData'
        })
    },
    methods: {
        goToNewRelease() {
            window.open(this.getReleaseData.html_url, '_blank')
        }
    }
}
</script>

<template>
    <v-menu
        :close-on-content-click="false"
        offset-x
        right
    >
        <template #activator="{ on: menu, attrs }">
            <v-tooltip top>
                <template #activator="{ on: tooltip }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                    >
                        <v-icon>{{ $icons.mdiDotsHorizontal }}</v-icon>
                    </v-btn>
                </template>
                <span>Options</span>
            </v-tooltip>
        </template>

        <v-sheet class="d-flex">
            <download-script :item="item" />
            <edit-script v-if="item.type === 'file'" :item="item" @edited="$emit('edited')" />
            <edit-folder v-else-if="item.type === 'folder'" :item="item" @edited="$emit('edited')" />
            <delete-script :item="item" @deleted="$emit('deleted')" />
        </v-sheet>
    </v-menu>
</template>

<script>
import DownloadScript from '~/components/scripts/DownloadScript.vue'
import EditScript from '~/components/scripts/EditScript.vue'
import EditFolder from '~/components/scripts/EditFolder.vue'
import DeleteScript from '~/components/scripts/DeleteScript.vue'

export default {
    name: 'OptionsMenu',
    components: {
        DownloadScript,
        EditScript,
        EditFolder,
        DeleteScript
    },
    props: {
        item: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        }
    }
}
</script>

<template>
    <v-menu
        :close-on-content-click="false"
        offset-x
        right
    >
        <template #activator="{ on: menu, attrs }">
            <v-tooltip left>
                <template #activator="{ on: tooltip }">
                    <v-btn
                        dark
                        icon
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                    >
                        <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>
                <span>Options</span>
            </v-tooltip>
        </template>

        <v-sheet class="d-flex">
            <edit-script :item="item" />
            <delete-script :item="item" @deleted="$emit('deleted')" />
        </v-sheet>
    </v-menu>
</template>

<script>
import EditScript from '~/components/scripts/EditScript.vue'
import DeleteScript from '~/components/scripts/DeleteScript.vue'

export default {
    name: 'OptionsMenu',
    components: {
        EditScript,
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
    },
    data() {
        return {}
    },
    methods: {
        info() {
            console.log(this.item)
        }
    }
}
</script>

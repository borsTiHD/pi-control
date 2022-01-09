<template>
    <v-tooltip bottom :disabled="!tooltip">
        <template #activator="{ on, attrs }">
            <v-chip
                class="ma-2"
                :color="value ? activeColor : ''"
                v-bind="attrs"
                v-on="on"
                @click="$emit('clicked')"
            >
                <v-icon left>
                    {{ icon }}
                </v-icon>
                {{ value || '-' }}
            </v-chip>
        </template>
        <span>Show all installed packages</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'DisplayAmount',
    props: {
        value: {
            type: [Number, Boolean],
            default: false
        },
        activeColor: {
            type: String,
            default: 'primary'
        },
        icon: {
            type: String,
            default: ''
        },
        tooltip: {
            type: [String, Boolean],
            default: false
        }
    }
}
</script>

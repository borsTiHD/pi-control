<template>
    <v-tooltip bottom :disabled="tooltipDisabled">
        <template #activator="{ on }">
            <v-btn
                :x-small="xSmall" :small="small" :large="large" :x-large="xLarge"
                :disabled="disabled" :loading="loading" :href="href" :target="target" :class="btnClass" :color="btnColor"
                :block="block" :outlined="outlined" :text="text" :depressed="depressed" :dark="dark" :light="light"
                @click="handleClick" v-on="on"
            >
                <v-icon v-if="icon" :class="iconClass" :size="iconSize">{{ icon }}</v-icon>
                {{ name }}
            </v-btn>
        </template>
        <span v-html="tooltip" />
    </v-tooltip>
</template>

<script>
export default {
    name: 'Button',
    props: {
        name: {
            type: String,
            default: ''
        },
        tooltip: {
            type: String,
            default: ''
        },
        tooltipDisabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        href: {
            type: [String, Boolean],
            default: false
        },
        target: {
            type: [String, Boolean],
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        btnClass: {
            type: String,
            default: 'mr-1'
        },
        btnColor: {
            type: String,
            default: 'primary'
        },
        iconClass: {
            type: String,
            default: 'mr-1'
        },
        iconSize: {
            type: Number,
            default: 18
        },
        xSmall: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        },
        large: {
            type: Boolean,
            default: false
        },
        xLarge: {
            type: Boolean,
            default: false
        },
        block: {
            type: Boolean,
            default: false
        },
        outlined: {
            type: Boolean,
            default: false
        },
        text: {
            type: Boolean,
            default: false
        },
        depressed: {
            type: Boolean,
            default: false
        },
        dark: {
            type: Boolean,
            default: false
        },
        light: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick() {
            this.$emit('click')
        }
    }
}
</script>

<style scoped>
    .v-btn {
        text-transform: none !important;
    }
</style>

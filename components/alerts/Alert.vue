<template>
    <v-alert
        :border="data.border"
        :color="data.color"
        :colored-border="data.coloredBorder"
        :dense="data.dense"
        :prominent="data.prominent"
        :outlined="data.outlined"
        :text="data.text"
        :type="data.type"
        :icon="data.icon"
    >
        <div v-if="data.erasable" class="d-flex">
            <div class="mr-auto align-self-center">
                <div v-for="(text, index) in data.content.split('\n')" :key="index">
                    {{ text }}
                </div>
            </div>
            <div class="align-self-center">
                <v-btn
                    icon
                    small
                    :color="data.color"
                    @click="deleteAlert"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </div>
        <span v-else>
            {{ data.content }}
        </span>
    </v-alert>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'Alert',
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    erasable: {
                        type: Boolean,
                        default: false
                    },
                    group: {
                        type: String,
                        default: ''
                    },
                    border: {
                        type: Boolean,
                        default: false
                    },
                    color: {
                        type: String,
                        default: 'blue'
                    },
                    coloredBorder: {
                        type: Boolean,
                        default: false
                    },
                    dense: {
                        type: Boolean,
                        default: false
                    },
                    prominent: {
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
                    type: {
                        type: String,
                        default: 'info'
                    },
                    icon: {
                        type: String,
                        default: ''
                    },
                    content: {
                        type: String,
                        default: ''
                    }
                }
            }
        }
    },
    methods: {
        ...mapMutations({
            clearAlertByIndex: 'alerts/clearAlertByIndex'
        }),
        deleteAlert() {
            this.clearAlertByIndex(this.data.index)
        }
    }
}
</script>

<style scoped>
</style>

<template>
    <v-dialog
        v-model="showModal"
        max-width="600px"
        :persistent="persistent"
        @click:outside="onOutside"
    >
        <v-form
            ref="form"
            v-model="isValid"
            @submit.prevent="onSubmit"
        >
            <v-card :elevation="getElevation" :outlined="getOutlined">
                <v-card-title>{{ title }}</v-card-title>
                <v-divider />
                <v-card-text>
                    <v-container>
                        <v-row v-if="input">
                            <v-col
                                :cols="mode === 'file' ? 10 : 12"
                            >
                                <v-text-field
                                    v-model="input.name"
                                    :label="mode === 'file' ? 'File name:' : 'Folder name:'"
                                    :rules="[ validateTextfield ]"
                                    :required="true"
                                    :autofocus="true"
                                />
                            </v-col>
                            <v-col
                                v-if="mode === 'file'"
                                cols="2"
                            >
                                <v-text-field
                                    v-model="input.ext"
                                    label="Extension:"
                                    :rules="[ validateTextfield ]"
                                    :required="true"
                                />
                            </v-col>
                            <v-col
                                v-if="mode === 'file'"
                                cols="12"
                            >
                                <v-textarea
                                    v-model="input.content"
                                    label="Script content:"
                                    :rules="[ validateTextfield ]"
                                    :required="true"
                                    auto-grow
                                    clearable
                                    counter
                                    outlined
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        v-if="cancelButton"
                        color="seconary"
                        text
                        @click="onCancel"
                    >
                        {{ cancelButton }}
                    </v-btn>
                    <v-btn
                        v-if="resetButton"
                        color="info"
                        text
                        @click="onReset"
                    >
                        {{ resetButton }}
                    </v-btn>
                    <v-btn
                        :disabled="!isValid"
                        color="primary"
                        type="submit"
                    >
                        {{ okButton }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'NewScriptPrompt',
    data: () => ({
        isValid: false,
        showModal: false,
        mode: undefined, // 'file', or 'folder'
        persistent: false,
        title: undefined,
        okButton: undefined,
        cancelButton: undefined,
        resetButton: undefined,
        input: undefined,
        // Private - Promises
        resolvePromise: undefined,
        rejectPromise: undefined
    }),
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    },
    methods: {
        show(opts = {}) {
            // Set few settings
            this.title = 'New Script'
            this.okButton = 'Submit'
            this.cancelButton = 'Cancel'
            this.resetButton = 'Reset'
            this.mode = 'file' // 'file', or 'folder'
            this.input = {
                name: '',
                ext: 'sh',
                content: ''
            }

            // Set data if options delivered
            if (opts?.mode) { this.mode = opts.mode }
            if (opts?.title) { this.title = opts.title }
            if (opts?.input && Object.keys(opts?.input).length > 0) { this.input = opts.input }

            // Opens Modal
            this.showModal = true

            // Return promise, damit Parent Component die Ergebnisse bekommt
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },
        onSubmit() {
            this.$refs.form.resetValidation()
            this.$refs.form.validate()
            if (!this.isValid) {
                console.warn('[User Prompt] -> Couldn\'t validate data, please try again.')
                return false
            }

            // Resolves Promise
            this.resolvePromise(this.input)

            // Cleaning + closing Modal
            this.cleaning()
            this.showModal = false
        },
        onOutside() {
            if (!this.persistent) {
                // Rejected Promise
                this.rejectPromise(new Error('User canceled the prompt.'))

                // Cleaning + closing Modal
                this.cleaning()
                this.showModal = false
            }
        },
        onCancel() {
            // Rejected Promise
            this.rejectPromise(new Error('User canceled the prompt.'))

            // Cleaning + closing Modal
            this.cleaning()
            this.showModal = false
        },
        onReset() {
            this.$refs.form.reset()
        },
        cleaning() {
            // Default settings
            this.isValid = false
            this.showModal = false
            this.persistent = false
            this.mode = undefined
            this.title = undefined
            this.okButton = undefined
            this.cancelButton = undefined
            this.resetButton = undefined
            this.input = undefined
            this.resolvePromise = undefined
            this.rejectPromise = undefined
        },
        validateTextfield(v) {
            if (!v) return 'Required'
            return true
        }
    }
}
</script>

<style scoped>
</style>

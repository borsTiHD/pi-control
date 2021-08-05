<template>
    <v-tooltip left>
        <template #activator="{ on, attrs }">
            <v-chip
                color="primary"
                bordered
                small
                v-bind="attrs"
                v-on="on"
                @click="dialog = true"
            >
                <v-icon left>{{ $icons.mdiHeart }}</v-icon>
                DONATE
            </v-chip>

            <v-dialog
                v-model="dialog"
                width="500"
            >
                <v-card>
                    <v-card-title class="text-h5">
                        Thank you! ❤️
                    </v-card-title>

                    <v-card-text>
                        Thank you so much for considering donating to me, I really appreciate it. Your donation will help me continue to work on the app and add new features.
                    </v-card-text>

                    <v-card-text class="d-flex mt-2">
                        <app-button
                            name="PayPal.Me"
                            tooltip="Send via PayPal.Me"
                            btn-color="#0070ba"
                            btn-class="flex-grow-1"
                            :icon="$icons.mdiCreditCardOutline"
                            outlined
                            @click="openPaypalMe"
                        />
                        <v-spacer />
                        <span>or</span>
                        <v-spacer />
                        <app-button
                            name="☕ Buy Me a Coffee"
                            tooltip="Send via buymeacoffee.com"
                            btn-color="#fd0"
                            btn-class="flex-grow-1"
                            outlined
                            @click="openBuyMeACoffee"
                        />
                    </v-card-text>

                    <v-divider class="mx-4" />

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="primary"
                            text
                            @click="dialog = false"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <span>Open for more information</span>
    </v-tooltip>
</template>

<script>
import AppButton from '@/components/Button.vue'

export default {
    name: 'Donate',
    components: {
        AppButton
    },
    data() {
        return {
            dialog: false,
            paypalMe: 'https://paypal.me/borstihd',
            buyMeACoffee: 'https://www.buymeacoffee.com/borstihd'
        }
    },
    methods: {
        openPaypalMe() {
            window.open(this.paypalMe, '_blank')
        },
        openBuyMeACoffee() {
            window.open(this.buyMeACoffee, '_blank')
        }
    }
}
</script>

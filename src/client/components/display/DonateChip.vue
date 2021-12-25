<template>
    <v-tooltip left>
        <template #activator="{ on, attrs }">
            <v-chip
                color="#F82449"
                bordered
                small
                dark
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

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" class="d-flex">
                                <app-button
                                    name="PayPal.Me"
                                    tooltip="Send via PayPal.Me"
                                    btn-color="#0070ba"
                                    btn-class="flex-grow-1"
                                    :icon="$icons.mdiCreditCardOutline"
                                    :href="paypalMe"
                                    target="_blank"
                                    outlined
                                />
                                <v-spacer />
                                <span class="align-self-center">or</span>
                                <v-spacer />
                                <app-button
                                    name="☕ Buy Me a Coffee"
                                    tooltip="Send via buymeacoffee.com"
                                    btn-color="#fd0"
                                    btn-class="flex-grow-1"
                                    :href="buyMeACoffee"
                                    target="_blank"
                                    outlined
                                />
                            </v-col>
                            <v-col class="d-flex justify-center">
                                <app-button
                                    name="❤ Github Sponsor"
                                    tooltip="Support via Github"
                                    btn-color="primary"
                                    :href="githubSponsor"
                                    target="_blank"
                                    outlined
                                />
                            </v-col>
                        </v-row>
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
    name: 'DonateChip',
    components: {
        AppButton
    },
    data() {
        return {
            dialog: false,
            paypalMe: 'https://paypal.me/borstihd',
            buyMeACoffee: 'https://www.buymeacoffee.com/borstihd',
            githubSponsor: 'https://github.com/sponsors/borsTiHD'
        }
    }
}
</script>

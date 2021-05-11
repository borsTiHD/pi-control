<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="headline">Test...</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-subheader>test...</v-subheader>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="test"
                                    label="set api token for stock requests"
                                    hide-details="auto"
                                    clearable
                                    single-line
                                    outlined
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" text @click="testBtn">test</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :elevation="snackbar.elevation"
        >
            {{ snackbar.text }}
            <template #action="{ attrs }">
                <v-btn
                    :color="snackbar.btnColor"
                    text
                    v-bind="attrs"
                    @click="snackbar.show = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            test: 'Test Text',
            snackbar: {
                show: false,
                text: 'Lorem ipsum dolor sit amet',
                color: '',
                btnColor: 'primary',
                elevation: 24
            }
        }
    },
    methods: {
        testBtn() {
            console.log('pressed...')
        }
    }
}
</script>

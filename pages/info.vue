<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card>
                <v-card-title class="headline">Pi Info Page</v-card-title>
                <v-card-text>
                    <span>Read some infos...</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6">
            <v-card>
                <v-card-title class="headline">Test - Api Calls</v-card-title>
                <v-card-actions>
                    <v-btn
                        :loading="loadingTestBtn"
                        :disabled="loadingTestBtn"
                        @click="testBtn"
                    >
                        Spawn Test Script
                    </v-btn>
                    <v-btn
                        :loading="loadingHelpBtn"
                        :disabled="loadingHelpBtn"
                        @click="testHelpBtn"
                    >
                        Help Call
                    </v-btn>
                    <v-btn
                        @click="testErrorBtn"
                    >
                        Error Call
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            loadingTestBtn: false,
            loadingHelpBtn: false
        }
    },
    methods: {
        testBtn() {
            const url = '/execute'
            this.loadingTestBtn = true
            this.$axios.post(url, null, {
                params: {
                    script: 'test',
                    args: ['a', 'b', 'c']
                }
            })
                .then((res) => {
                    console.log('Response Data:', res.data)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingTestBtn = false
                })
        },
        testHelpBtn() {
            const url = '/help'
            this.loadingHelpBtn = true
            this.$axios.get(url)
                .then((res) => {
                    console.log('Response Data:', res.data)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingHelpBtn = false
                })
        },
        testErrorBtn() {
            const url = '/execute'
            this.$axios.post(url, null, {
                params: {
                    script: 'not-found'
                }
            })
                .then((res) => {
                    console.log('Response Data:', res.data)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>

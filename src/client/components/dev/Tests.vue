<template>
    <v-card :elevation="getElevation" :outlined="getOutlined">
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Tests',
    data() {
        return {
            loadingTestBtn: false,
            loadingHelpBtn: false
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    },
    methods: {
        testBtn() {
            const url = '/scripts/execute'
            this.loadingTestBtn = true
            this.$axios.post(url, null, {
                params: {
                    script: 'tests\\test',
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
            const url = '/scripts/execute'
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

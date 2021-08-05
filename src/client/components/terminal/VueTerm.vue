<template>
    <div v-resize="onResize" class="xterm" />
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { Unicode11Addon } from 'xterm-addon-unicode11'

export default {
    name: 'VueTerm',
    data: () => ({
        options: {
            fontFamily: '\'Fira Mono\', monospace',
            fontSize: 15,
            cursorBlink: true
            // rows: 120
        },
        resizeActive: false,
        resizeAllowed: true,
        terminal: null,
        fitAddon: null
    }),
    mounted() {
        const term = new Terminal(this.options)
        this.fitAddon = new FitAddon()
        term.loadAddon(this.fitAddon)
        term.loadAddon(new Unicode11Addon())
        term.unicode.activeVersion = '11'
        term.open(this.$el)
        this.fitAddon.fit()

        // Register Terminal
        this.terminal = term
        this.termEvents() // Key+GUI Events

        // Prevents resize event from being executed before mounting
        this.resizeActive = true
    },
    beforeDestroy() {
        /*
        this.terminal.selectAll()
        this.$emit('update:buffer', this.terminal.getSelection().trim())
        this.terminal.clear()
        */
    },
    activated() {
        // Clears old terminal data
        this.clear()

        // Resizing is allowed
        this.resizeAllowed = true
    },
    deactivated() {
        // Clears terminal data
        this.clear()

        // Resizing is not allowed
        this.resizeAllowed = false
    },
    methods: {
        fit() {
            if (this.resizeAllowed) {
                const { cols, rows } = this.fitAddon.proposeDimensions()
                this.terminal.resize(cols, rows)
                this.fitAddon.fit()
                this.$emit('resized', { cols, rows })
            }
        },
        focus() {
            this.terminal.focus()
        },
        blur() {
            this.terminal.blur()
        },
        write(data) {
            this.terminal.write(data) // Writes data into the terminal
            this.terminal.scrollToBottom()
        },
        clear() {
            this.terminal.clear()
        },
        typing(data) {
            this.$emit('typing', data) // Sending written data to parent component
            // this.write(data) // Don't need to write data manually in terminal... they come back themselves via an event
        },
        onResize() {
            if (this.resizeActive) {
                this.fit()
            } else {
                setImmediate(() => {
                    this.fit()
                })
            }
        },
        termEvents() {
            // Keyboard input by the user
            this.terminal.onKey((e) => {
                // Sends raw key
                this.typing(e.key)
            })

            /*
            // Mouse Click Events
            this.terminal.element.addEventListener('contextmenu', async(e) => {
                console.log('window.navigator', window.navigator)
                // Get data from clipboard and paste it in
                const clip = await window.navigator.clipboard.readText()
                this.typing(clip)
            })

            // Text Selection -> Copy selected text and put it in clipboard
            this.terminal.onSelectionChange(async() => {
                const selection = this.terminal.getSelection()
                await window.navigator.clipboard.writeText(selection)
                this.$toast.info('Text copied...')
            })
            */

            // GUI Events
            /*
            this.terminal.on('blur', () => this.$emit('blur'))
            this.terminal.on('focus', () => this.$emit('focus'))
            this.terminal.onTitleChange((title) => this.$emit('title-change', title))
            */
        }
    }
}
</script>

<style scoped>
.xterm {
    height: 100%;
    width: 100%;
}
</style>

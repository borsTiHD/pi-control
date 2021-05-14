export default ({ app }, inject) => {
    /**
     * runScript() : Execute script on host and returns script output
     * @param       {string}        script  -> Script path/name (exp.: path.join('server', 'misc', 'kernel info.sh') -> results in '/scripts/server/misc/...')
     * @returns     {data|error}            -> Returns script output data
     */
    const runScript = async(script, args = []) => {
        const url = '/scripts/execute' // API Endpoint
        const data = await app.$axios.post(url, null, { params: { script, args } })
            .then((res) => {
                const data = res.data
                console.log(`[Script] -> Executed (${script}):`, data)
                if (data.error || data._status === 'error') {
                    throw new Error(data.info)
                } else {
                    return data.response.output || data.response || data.info || true
                }
            }).catch((error) => {
                app.$toast.error(error.message)
                console.error(error)
                throw error
            })
        return data
    }

    // Inject $runScript in Vue, context and store
    inject('runScript', runScript)
}

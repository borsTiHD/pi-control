import { Database } from '@vuex-orm/core'
import Process from '@/models/Process'
import Uptime from '@/models/Uptime'

const database = new Database()

// Registering Models
database.register(Process)
database.register(Uptime)

export default database

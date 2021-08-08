import { Database } from '@vuex-orm/core'
import Process from '@/models/Process'
import Uptime from '@/models/Uptime'
import Temperature from '@/models/Temperature'

const database = new Database()

// Registering Models
database.register(Process)
database.register(Uptime)
database.register(Temperature)

export default database

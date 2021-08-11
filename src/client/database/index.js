import { Database } from '@vuex-orm/core'
import Device from '@/models/Device'
import Process from '@/models/Process'
import Uptime from '@/models/Uptime'
import Temperature from '@/models/Temperature'
import System from '@/models/System'

const database = new Database()

// Registering Models
database.register(Device)
database.register(Process)
database.register(Uptime)
database.register(Temperature)
database.register(System)

export default database

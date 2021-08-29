import { Database } from '@vuex-orm/core'
import Device from '@/models/Device'
import Process from '@/models/Process'
import Uptime from '@/models/Uptime'
import Temperature from '@/models/Temperature'
import System from '@/models/System'
import Memory from '@/models/Memory'
import Swap from '@/models/Swap'

const database = new Database()

// Registering Models
database.register(Device)
database.register(Process)
database.register(Uptime)
database.register(Temperature)
database.register(System)
database.register(Memory)
database.register(Swap)

export default database

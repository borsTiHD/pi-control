import { Database } from '@vuex-orm/core'
import Device from '@/models/Device'
import Process from '@/models/Process'
import Package from '@/models/Package'
import Uptime from '@/models/Uptime'
import Temperature from '@/models/Temperature'
import Hardware from '@/models/Hardware'
import System from '@/models/System'
import Memory from '@/models/Memory'
import Swap from '@/models/Swap'
import Cpu from '@/models/Cpu'
import Diskspace from '@/models/Diskspace'

const database = new Database()

// Registering Models
database.register(Device)
database.register(Process)
database.register(Package)
database.register(Uptime)
database.register(Temperature)
database.register(Hardware)
database.register(System)
database.register(Memory)
database.register(Swap)
database.register(Cpu)
database.register(Diskspace)

export default database

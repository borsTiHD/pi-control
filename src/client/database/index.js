import { Database } from '@vuex-orm/core'
import Process from '@/models/Process'

const database = new Database()

// Registering Models
database.register(Process)

export default database

import { install } from '@vuex-orm/core'
import database from '@/database'

export default ({ store }) => {
    install(database)(store)
}

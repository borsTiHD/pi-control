import VuexORM from '@vuex-orm/core'
import database from '@/database'

export default ({ store }) => {
    VuexORM.install(database)(store)
}

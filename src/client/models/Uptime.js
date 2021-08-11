import { Model } from '@vuex-orm/core'

export default class Uptime extends Model {
    static entity = 'uptimes'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            device_id: this.string(null),
            uptime: this.string('').nullable()
        }
    }
}

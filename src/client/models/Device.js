import { Model } from '@vuex-orm/core'
import Uptime from '@/models/Uptime'

export default class Device extends Model {
    static entity = 'devices'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            name: this.string(''),
            uptime: this.hasOne(Uptime, 'device_id')
        }
    }
}

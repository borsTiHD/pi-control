import { Model } from '@vuex-orm/core'

export default class Memory extends Model {
    static entity = 'memories'

    static primaryKey = ['timestamp']

    static fields() {
        return {
            timestamp: this.number(0),
            available: this.number(0),
            cache: this.number(0),
            free: this.number(0),
            shared: this.number(0),
            total: this.number(0),
            used: this.number(0)
        }
    }
}

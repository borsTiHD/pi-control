import { Model } from '@vuex-orm/core'

export default class Swap extends Model {
    static entity = 'swaps'

    static primaryKey = ['timestamp']

    static fields() {
        return {
            timestamp: this.number(0),
            free: this.number(0),
            total: this.number(0),
            used: this.number(0)
        }
    }
}

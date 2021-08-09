import { Model } from '@vuex-orm/core'

export default class Temperature extends Model {
    static entity = 'temperatures'

    static primaryKey = ['timestamp']

    static fields() {
        return {
            temperature: this.string(''),
            timestamp: this.number(0)
        }
    }
}

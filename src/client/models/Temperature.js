import { Model } from '@vuex-orm/core'

export default class Temperature extends Model {
    static entity = 'temperatures'

    static primaryKey = ['id', 'timestamp']

    static fields() {
        return {
            id: this.uid(),
            temperature: this.string(''),
            timestamp: this.number(0)
        }
    }
}

import { Model } from '@vuex-orm/core'

export default class System extends Model {
    static entity = 'system'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            name: this.string(''),
            state: this.string('')
        }
    }
}

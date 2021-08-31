import { Model } from '@vuex-orm/core'

export default class Hardware extends Model {
    static entity = 'hardware'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            name: this.string(''),
            state: this.string('')
        }
    }
}

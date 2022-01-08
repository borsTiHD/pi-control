import { Model } from '@vuex-orm/core'

export default class Process extends Model {
    static entity = 'packages'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            name: this.string(''),
            version: this.string(''),
            installed: this.string('')
        }
    }
}

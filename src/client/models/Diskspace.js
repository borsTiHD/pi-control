import { Model } from '@vuex-orm/core'

export default class Diskspace extends Model {
    static entity = 'diskspaces'

    static primaryKey = ['id']

    static fields() {
        return {
            id: this.uid(),
            available: this.number(0),
            filesystem: this.string(''),
            mounted: this.string(''),
            total: this.number(0),
            type: this.string(''),
            used: this.number(''),
            usedPercentage: this.number('')
        }
    }
}

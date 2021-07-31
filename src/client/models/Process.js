import { Model } from '@vuex-orm/core'

export default class Process extends Model {
    static entity = 'processes'

    static primaryKey = ['id', 'pid']

    static fields() {
        return {
            id: this.uid(),
            pid: this.number(0),
            user: this.string(''),
            pr: this.string(''),
            ni: this.string(''),
            virt: this.string(''),
            res: this.string(''),
            shr: this.string(''),
            s: this.string(''),
            cpu: this.number(0),
            mem: this.number(0),
            time: this.string(''),
            command: this.string('')
        }
    }
}

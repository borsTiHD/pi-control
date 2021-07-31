import { Model } from '@vuex-orm/core'

export default class Process extends Model {
    static entity = 'processes'

    static fields() {
        return {
            id: this.uid(),
            pid: this.string(''),
            user: this.string(''),
            pr: this.string(''),
            ni: this.string(''),
            virt: this.string(''),
            res: this.string(''),
            shr: this.string(''),
            s: this.string(''),
            cpu: this.string(''),
            mem: this.string(''),
            time: this.string(''),
            command: this.string('')
        }
    }
}

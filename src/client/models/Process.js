import { Model } from '@vuex-orm/core'

export default class Process extends Model {
    static entity = 'processes'

    static primaryKey = ['id', 'pid']

    static fields() {
        return {
            id: this.uid(),
            pid: this.number(0),
            ppid: this.number(0),
            uid: this.number(0),
            user: this.string(''),
            cpu: this.number(0),
            mem: this.number(0),
            time: this.string(''),
            name: this.string(''),
            cmd: this.string('')
        }
    }
}

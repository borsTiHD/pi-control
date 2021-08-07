import { Model } from '@vuex-orm/core'

export default class Process extends Model {
    static entity = 'processes'

    static primaryKey = ['id', 'pid']

    static fields() {
        return {
            id: this.uid(),
            pid: this.number(0),
            ppid: this.number(0).nullable(),
            uid: this.number(0).nullable(),
            user: this.string('').nullable(),
            cpu: this.number(0),
            memory: this.number(0).nullable(),
            time: this.string('').nullable(),
            name: this.string(''),
            cmd: this.string('').nullable(),
            // Additional fields, only used on windows
            handles: this.string('').nullable(),
            npm: this.number(0).nullable(),
            pm: this.number(0).nullable(),
            si: this.number(0).nullable(),
            ws: this.number(0).nullable()
        }
    }
}

import { Model } from '@vuex-orm/core'

export default class Cpu extends Model {
    static entity = 'cpus'

    static primaryKey = ['timestamp']

    static fields() {
        return {
            timestamp: this.number(0),
            hi: this.number(0),
            id: this.number(0),
            ni: this.number(0),
            si: this.number(0),
            st: this.number(0),
            sy: this.number(0),
            us: this.number(0),
            wa: this.number(0)
        }
    }
}

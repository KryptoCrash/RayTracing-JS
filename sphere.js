var Vector = require('./vector.js')
module.exports = class Sphere {
    constructor(pos, radius) {
        this.pos = pos
        this.radius = radius
    }
    intersect(ray) {
        let O = ray.origin
        let D = ray.dir
        let C = this.pos
        let r = this.radius
        let a = Vector.dot(D, D)
        let b = 2 * Vector.dot(D, O - C)
        let c = Vector.dot(O - C, O - C) - r ** 2
        let disc = b ** 2 - 4 * a * c
        if(disc < 0) {
            return {
                obj: this,
                ray: ray,
                dist: Infinity
            }
        }
        return {
            obj: this,
            ray: ray,
            dist: (-b - Math.sqrt(disc)) / 2 * a
        }
    }
}

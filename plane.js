import Vector from './vector.js'
export default class Plane {
    constructor(n, color) {
        this.normal = Vector.norm(n)
        this.color = color
    }
    intersect(ray) {
        return {
            obj: this,
            ray: ray,
            dist: -(Vector.dot(ray.origin, this.normal)) / Vector.dot(ray.dir, this.normal)
        }
    }
}
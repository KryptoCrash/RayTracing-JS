import Vector from '../Vectors/vector.js'
export default class Plane {
    constructor(n, color) {
        this.normal = Vector.norm(n)
        this.color = color
    }
    intersect(ray) {
        var denom = Vector.dot(this.normal, ray.dir)
        var inter = {
            obj: this,
            ray: ray,
            dist: -(Vector.dot(ray.origin, this.normal)) / denom
        }
        inter.pos = Vector.add(Vector.multiply(inter.dist,ray.dir),ray.origin)
        inter.normal = this.normal
        if (denom > 0) inter.normal = Vector.multiply(-1,inter.normal)
        return inter
    }
}
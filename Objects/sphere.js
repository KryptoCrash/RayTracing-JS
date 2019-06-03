import Vector from '../Vectors/vector.js'
export default class Sphere {
    constructor(pos, radius, color) {
        this.pos = pos
        this.radius = radius
        this.color = color
    }
    intersect(ray) {
        let O = ray.origin
        let D = ray.dir
        let C = this.pos
        let OC = Vector.subtract(O, C)
        let r = this.radius
        let a = Vector.dot(D, D)
        let b = 2 * Vector.dot(D, OC)
        let c = Vector.dot(OC, OC) - r ** 2
        let disc = b ** 2 - 4 * a * c
        if(disc < 0) {
            var inter = {
                obj: this,
                ray: ray,
                dist: Infinity
            }
        } else {
            var inter = {
                obj: this,
                ray: ray,
                dist: (-b - Math.sqrt(disc)) / 2 * a
            }
        }
        
        inter.pos = Vector.add(Vector.multiply(inter.dist,ray.dir),ray.origin)
        inter.normal = Vector.norm(Vector.subtract(inter.pos, inter.obj.pos))
        return inter;
    }
}

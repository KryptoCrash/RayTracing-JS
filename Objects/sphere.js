import Vector from '../Vectors/vector.js'
export default class Sphere {
    constructor(pos, radius, color, surfaceType, albedo) {
        this.pos = pos
        this.radius = radius
        this.color = color
        this.surfaceType = surfaceType
        this.albedo = albedo
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
            return {
                obj: this,
                ray: ray,
                dist: Infinity
            }
        }
        let dist = (-b - Math.sqrt(disc)) / 2 * a
        let intersectPoint = Vector.add(ray.origin, Vector.multiply(dist, ray.dir))
        let hitNormal = Vector.norm( Vector.subtract(intersectPoint, this.pos) )
        return {
            obj: this,
            ray: ray,
            dist: dist,
            intersectPoint: intersectPoint,
            hitNormal: hitNormal
        }
    }
}

import Vector from '../Vectors/vector.js'
export default class Plane {
    constructor(n, color, surfaceType, albedo) {
        this.normal = Vector.norm(n)
        this.color = color
        this.surfaceType = surfaceType;
        this.albedo = albedo;
    }
    intersect(ray) {
        let dist = -(Vector.dot(ray.origin, this.normal)) / Vector.dot(ray.dir, this.normal)
        let intersectPoint = Vector.add(ray.origin, Vector.multiply(dist, ray.dir))
        return {
            obj: this,
            ray: ray,
            dist: dist,
            intersectPoint: intersectPoint,
            hitNormal: this.normal
        }
    }
}
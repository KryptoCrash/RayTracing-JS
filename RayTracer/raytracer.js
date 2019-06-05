import Vector from '../Vectors/vector.js'
import Ray from './ray.js'
import Color from '../Vectors/color.js'
import Sphere from '../Objects/sphere.js'
import Plane from '../Objects/plane.js'
export default class RayTracer {
    constructor(scene, canvas) {
        this.scene = scene;
        this.camera = scene.camera;
        this.canvas = canvas;
    }
    render() {
        for(let y = 0; y < this.canvas.height; y++) {
            for(let x = 0; x < this.canvas.width; x++) {
                let pxColor = this.shootRay(
                    new Ray(this.camera.pos, this.getDir(x, y, this.camera)),
                    this.scene,
                    0
                )
                this.canvas.fillStyle = `rgb(${pxColor.red}, ${pxColor.green}, ${pxColor.blue})`
                this.canvas.fillRect(x, y, x + 1, y + 1)
            }
        }
    }
    getDir(x, y, camera) {
        let xx = (2 * ((x + 0.5) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio; 
        let yy = (1 - 2 * ((y + 0.5) * (1 / this.canvas.height))) * camera.angle;
        return Vector.norm(
            Vector.add(
                camera.forward,
                Vector.add(
                    Vector.multiply(xx, camera.right),
                    Vector.multiply(yy, camera.up)
                )
            )
        )
    }
    shootRay(ray, scene, iter) {
        let inter = this.checkForIntersect(ray, scene)
        if(inter) {
            return this.shade(ray, inter, scene)
        } else return new Color(0, 0, 0)
    }
    shade(ray, inter, scene) {
        let intersectPoint = inter.intersectPoint
        let hitNormal = inter.hitNormal
        let surfaceType = inter.obj.surfaceType
        if(this.inShadow(intersectPoint, scene.lights[0], scene)) {
            return new Color(0, 0, 0)
        } else if(surfaceType == 'diffuse') {
            let albedo = inter.obj.albedo
            let color = inter.obj.color
            let lightDir = Vector.norm(Vector.subtract(scene.lights[0].pos, intersectPoint))
            let facingRatio = Vector.dot(hitNormal, lightDir)
            let hitColor = Vector.multiply(
                (albedo / Math.PI) * facingRatio * scene.lights[0].intensity,
                color
            )
            return hitColor.toColor()
        }
    }
    inShadow(intersectPoint, light, scene) {
        let shadowRay = new Ray(intersectPoint, Vector.norm(Vector.subtract(light.pos, intersectPoint)))
        for(let i = 0; i < scene.objects.length; i++) {
            let obj = scene.objects[i]
            let isect = obj.intersect(shadowRay)
            if(isect.dist > 0 && isect.dist != Infinity) return true
        }
        return false
    }
    checkForIntersect(ray, scene) {
        let closestInter = undefined;
        let closestDist = Infinity;
        scene.objects.forEach(obj => {
            let inter = obj.intersect(ray)
            if(inter.dist != Infinity && inter.dist > 0 && inter.dist < closestDist) {
                closestInter = inter
                closestDist = inter.dist
            }
        });
        
        return closestInter
    }
}
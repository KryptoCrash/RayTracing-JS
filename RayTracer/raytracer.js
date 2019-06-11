import Vector from '../Vectors/vector.js'
import Ray from './ray.js'
import Sphere from '../Objects/sphere.js'
import Plane from '../Objects/plane.js'

const bias = 1e-6; // set to whatever

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
                this.canvas.fillStyle = `rgb(${pxColor.x}, ${pxColor.y}, ${pxColor.z})`
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
        if(iter > 2) return new Vector(0, 0, 0)
        if(inter) {
            return this.shade(ray, inter, scene, iter)
        } else return new Vector(0, 0, 0)
    }
    shade(ray, inter, scene, iter) {
        let intersectPoint = inter.intersectPoint
        let hitNormal = inter.hitNormal
        let surfaceType = inter.obj.surfaceType
        let finalHitColor = new Vector(0, 0, 0)
        
        {
            let hitColor = new Vector(0, 0, 0)
            scene.lights.forEach(light => {
            let lightDir = Vector.norm(Vector.subtract(light.pos, intersectPoint))
            let reflectDir = Vector.norm(Vector.subtract(inter.ray.dir, Vector.multiply(2 * Vector.dot(hitNormal, inter.ray.dir), hitNormal)))
            let reflectRay = new Ray(intersectPoint, reflectDir)
            let hitScalar = Vector.dot(reflectDir, lightDir)
            hitColor = Vector.add(hitColor, hitScalar > 0 ? Vector.multiply((hitScalar**20) * this.inShadow(intersectPoint, light, scene, inter.obj), light.color) : new Vector(0, 0, 0))
            })
            finalHitColor=Vector.add(finalHitColor, hitColor)
        }
        if(surfaceType=='specular') {
            let hitColor = new Vector(0, 0, 0)
            let reflectDir = Vector.norm(Vector.subtract(inter.ray.dir, Vector.multiply(2 * Vector.dot(hitNormal, inter.ray.dir), hitNormal)))
            for(let i = 0; i < 50; i++) {
            let reflectRay = new Ray(intersectPoint, Vector.norm(Vector.add(reflectDir, new Vector(Math.random()*0.3, Math.random()*0.3, Math.random()*0.3))))
            hitColor = Vector.add(hitColor, this.shootRay(reflectRay, scene, iter+1))
            }
            hitColor = Vector.multiply(1/50, hitColor)
            finalHitColor=Vector.add(finalHitColor, hitColor)
        }
        {
            let albedo = inter.obj.albedo
            let color = inter.obj.color
            let hitColor = new Vector(0, 0, 0)
            scene.lights.forEach(light => {
                let lightDir = light.dir || Vector.norm(Vector.subtract(light.pos, intersectPoint))
                let facingRatio = Vector.dot(hitNormal, lightDir) >= 0.02 ? Vector.dot(hitNormal, lightDir) : 0.02
                hitColor = Vector.add(hitColor, Vector.multiply(
                ((albedo / Math.PI) * facingRatio * light.intensity) * this.inShadow(intersectPoint, light, scene, inter.obj),
                Vector.multiplyVectors(color, light.color.fromRGB())
                ))
            })
            finalHitColor=Vector.add(finalHitColor, hitColor)
        }
        return finalHitColor
    }
    inShadow(intersectPoint, light, scene, objI) {
        let shadowScalar = 0
        for(let samples = 0; samples < 50; samples++) {
        let lightMag = Vector.mag(Vector.subtract(light.pos, intersectPoint))
        let lightDir = light.dir || Vector.norm(Vector.subtract(Vector.add(light.pos, new Vector(Math.random(), Math.random(), Math.random())), intersectPoint))
        let shadowRay = new Ray(intersectPoint, lightDir)
        let intersectFound = false
        for(let i = 0; i < scene.objects.length; i++) {
            let obj = scene.objects[i]
            let isect = obj.intersect(shadowRay)
            if(isect.dist > 0 && isect.dist != Infinity && isect.dist <= lightMag && obj != objI) intersectFound = true
        }
        intersectFound ? 0 : shadowScalar++
    }
    return shadowScalar/50
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
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
        this.rayCount = 0
    }
    render() {
        for(let y = 0; y < this.canvas.height; y++) {
            for(let x = 0; x < this.canvas.width; x++) {
                let pxColor = this.antiAlias(this.camera, x, y, this.scene, 1, 0)
                this.canvas.fillStyle = `rgb(${pxColor.x}, ${pxColor.y}, ${pxColor.z})`
                this.canvas.fillRect(x, y, x + 1, y + 1)
            }
        }
        return this.rayCount
    }
    antiAlias(camera, x, y, scene, pxSize, depth) {
        let pixelGrid = [
            {
                x : (2 * ((x + pxSize/2) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio, 
                y : (1 - 2 * ((y + pxSize/2) * (1 / this.canvas.height))) * camera.angle
            },
            {
                x : (2 * ((x + pxSize*Math.random()*0.5) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio,
                y : (1 - 2 * ((y + pxSize*Math.random()*0.5) * (1 / this.canvas.height))) * camera.angle
            },
            {
                x : (2 * ((x + pxSize*(0.5+Math.random()*0.5)) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio,
                y : (1 - 2 * ((y + pxSize*Math.random()*0.5) * (1 / this.canvas.height))) * camera.angle
            },
            {
                x : (2 * ((x + pxSize*Math.random()*0.5) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio,
                y : (1 - 2 * ((y + pxSize*(0.5+Math.random()*0.5)) * (1 / this.canvas.height))) * camera.angle
            },
            {
                x : (2 * ((x + pxSize*(0.5+Math.random()*0.5)) * (1 / this.canvas.width)) - 1) * camera.angle * camera.aspectRatio,
                y : (1 - 2 * ((y + pxSize*(0.5+Math.random()*0.5)) * (1 / this.canvas.height))) * camera.angle
            }
        ]

        let sampleCount = 0
        let sampleSum = new Vector(0, 0, 0)
        let allRayColors = []
        pixelGrid.forEach(rayOrigin => {
            let ray = this.shootRay(
                new Ray(camera.pos, Vector.norm(
                    Vector.add(
                        camera.forward,
                        Vector.add(
                            Vector.multiply(rayOrigin.x, camera.right),
                            Vector.multiply(rayOrigin.y, camera.up)
                        )
                    )
                )),
                scene,
                0
            )
            this.rayCount++
            allRayColors.push(ray)
            sampleSum = Vector.add(sampleSum, ray)
            sampleCount++
        })
        let sampleAvg = Vector.multiply(1/sampleCount, sampleSum)
        let deviation = new Vector(0, 0, 0)
        allRayColors.forEach(rayColor => {
            deviation = Vector.add(deviation, Vector.subtract(rayColor, sampleAvg).abs())
        })
        if(Vector.mag(deviation) < 100 || depth > 5) {
            return sampleAvg
        } else {
            return Vector.multiply(
                1/4,
                Vector.add(
                    Vector.add(
                        this.antiAlias(camera, x, y, scene, pxSize/2, depth+1),
                        this.antiAlias(camera, x+pxSize/2, y, scene, pxSize/2, depth+1)
                    ),
                    Vector.add(
                        this.antiAlias(camera, x, y+pxSize/2, scene, pxSize/2, depth+1),
                        this.antiAlias(camera, x+pxSize/2, y+pxSize/2, scene, pxSize/2, depth+1)
                    )
                )
            )
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
        if(iter > 1) return new Vector(0, 0, 0)
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
            this.rayCount++
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
            this.rayCount++
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
        this.rayCount++
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
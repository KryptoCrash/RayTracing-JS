import Vector from './vector.js'
import Ray from './ray.js'
import Color from './color.js'
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
        var recenterX = x =>(x - (this.canvas.width / 2.0)) / 2.0 / this.canvas.width;
        var recenterY = y => - (y - (this.canvas.height / 2.0)) / 2.0 / this.canvas.height;
        return Vector.norm(
            Vector.add(
                camera.forward,
                Vector.add(
                    Vector.multiply(recenterX(x), camera.right),
                    Vector.multiply(recenterY(y), camera.up)
                )
            )
        )
    }
    shootRay(ray, scene, iter) {
        let inter = this.checkForIntersect(ray, scene)
        return inter ? new Color(255, 0, 0) : new Color(0, 0, 0)
    }
    checkForIntersect(ray, scene) {
        let closestInter = undefined;
        let closestDist = Infinity;
        scene.objects.forEach(obj => {
            let inter = obj.intersect(ray)
            if(inter.dist != Infinity && inter.dist < closestDist) {
                closestInter = inter
                closestDist = inter.dist
            }
        });
        return closestInter
    }
}
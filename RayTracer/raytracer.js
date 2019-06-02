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
            if(inter.obj instanceof Sphere) {
            let pI = Vector.add(ray.origin, Vector.multiply(inter.dist, ray.dir))
            let sNormal = Vector.norm(Vector.subtract(pI, inter.obj.pos))
			
            let cVector = Vector.multiply(
                Vector.dot(
                    Vector.subtract(new Vector(0, 0, 0), ray.dir),
                    sNormal
                )*this.brightness(Vector.add(Vector.multiply(inter.dist,ray.dir),ray.origin),scene),
                inter.obj.color
            )
            return new Color(cVector.x, cVector.y, cVector.z)
            } else if(inter.obj instanceof Plane) {
                let cVector = Vector.multiply(
                    Vector.dot(
                        Vector.subtract(new Vector(0, 0, 0), ray.dir),
                        inter.obj.normal
                    )*this.brightness(Vector.add(Vector.multiply(inter.dist,ray.dir),ray.origin),scene),
                    inter.obj.color
                )
                return new Color(cVector.x, cVector.y, cVector.z)
            }
        } else return new Color(0, 0, 0)
    }
	brightness(pos,scene) {
		var sum=0.5;
		for (var i in scene.lights) {
			if (this.isLightVisible(pos,scene,scene.lights[i].pos)) sum=1;
		}
		return sum;
	}
	isLightVisible(pt, scene, pos) {
		return this.isLit(
			new Ray(Vector.add(pt,Vector.multiply(1e-10,Vector.norm(Vector.subtract(pos, pt)))),Vector.norm(Vector.subtract(pos,pt)))
		, scene)
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
	
    isLit(ray, scene) {
        for (var i in scene.objects) {
			let o = scene.objects[i]
			if (o instanceof Sphere) {
				if (Vector.mag(Vector.subtract(o.pos,ray.origin))<o.radius) return false
			}
		}
		return typeof this.checkForIntersect(ray,scene)==="undefined"
    }
}

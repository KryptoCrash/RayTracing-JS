module.exports = class Scene {
    constructor(objects, lights, camera) {
        this.objects = objects;
        this.lights = lights;
        this.camera = camera;
    }
}
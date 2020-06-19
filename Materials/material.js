export default class Material {
    constructor(diffuseScalar, specularScalar, mirrorScalar, mirrorOffset) {
        this.dS = diffuseScalar;
        this.sS = specularScalar;
        this.mS = mirrorScalar;
        this.mO = mirrorOffset;
    }
}
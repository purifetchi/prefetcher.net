import { OBJLoader } from "three/examples/jsm/Addons.js";
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import { Euler, Mesh, MeshNormalMaterial, Vector3 } from "three";

export default class ModelObject extends GameObject {
    constructor(opts : GameObjectOptions & {
        path: string,

        scale: Vector3,
        position: Vector3,
        rotation: Vector3
    }) {
        super(opts)

        const { path, scale, position, rotation } = opts
        const objLoader = new OBJLoader()
        objLoader.load(path, data => {
            data.scale.set(scale.x, scale.y, scale.z)
            data.position.set(position.x, position.y, position.z)
            data.setRotationFromEuler(new Euler(rotation.x, rotation.y, rotation.z))
            this.threeObject = data

            const normalMaterial = new MeshNormalMaterial()
            data.traverse(child => {
                if (child instanceof Mesh) {
                    child.material = normalMaterial
                }
            })
            
            this._attach()
        })
    }
}
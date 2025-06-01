import { FBXLoader } from "three/examples/jsm/Addons.js";
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import { AnimationMixer, Vector3 } from "three";
import AnimatorComponent from "../components/animatorComponent";

/**
 * The Ata game object.
 */
export default class AtaObject extends GameObject {
    _animator! : AnimatorComponent

    _tgt? : Vector3
    _src? : Vector3
    _t? : number

    constructor(opts: GameObjectOptions) {
        super(opts)

        const fbxLoader = new FBXLoader()
        fbxLoader.load("./game/AtaRetro.fbx", data => {
            data.scale.set(0.01, 0.01, 0.01)
            this.threeObject = data
            this._attach()

            this._animator = new AnimatorComponent({
                mixer: new AnimationMixer(data),
                animations: data.animations
            })
        })
    }

    tick(dt: number): void {
        this._animator?.update(dt)

        if (this.game.input.mousePressed) {
            const intersections = this.game.raycast()
            const [ object ] = intersections
            if (object !== undefined) {
                this._src = this.threeObject.position.clone()
                this._tgt = object.point
                this._t = 0

                this.threeObject.lookAt(object.point)
                this._animator.play("Armature|Walk")
            }
        }

        if (this._tgt !== undefined) {
            this._t! += dt

            const newPos = new Vector3().lerpVectors(this._src!, this._tgt, this._t!)
            this.threeObject.position.setX(newPos.x)
            this.threeObject.position.setY(newPos.y)
            this.threeObject.position.setZ(newPos.z)

            if (this._t! >= 1) {
                this._t = undefined
                this._tgt = undefined
                this._src = undefined

                this._animator.play("Armature|Idle")
            }
        }
    }
}
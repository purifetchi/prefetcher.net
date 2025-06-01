import { FBXLoader } from "three/examples/jsm/Addons.js";
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import { AnimationMixer, Mesh, MeshLambertMaterial, Vector3 } from "three";
import AnimatorComponent from "../components/animatorComponent";
import Tween from "../tweening/tween";

/**
 * The Ata game object.
 */
export default class AtaObject extends GameObject {
    _animator!: AnimatorComponent

    _movementTween?: Tween<Vector3>
    _rotationTween?: Tween<number>

    constructor(opts: GameObjectOptions) {
        super(opts)
        this.loadModel()
    }

    /**
     * Loads the Ata model.
     */
    loadModel() : void {
        const fbxLoader = new FBXLoader();
        fbxLoader.load("./game/AtaRetro.fbx", data => {
            data.scale.set(0.01, 0.01, 0.01);
            this.threeObject = data;
            this._attach();

            data.traverse(child => {
                if (child instanceof Mesh) {
                    const oldMaterial = child.material;
                    child.material = new MeshLambertMaterial({
                        color: oldMaterial.color || 0xffffff,
                        map: oldMaterial.map || null
                    });
                }
            })

            this._animator = new AnimatorComponent({
                mixer: new AnimationMixer(data),
                animations: data.animations
            })
        });
    }

    /**
     * Starts moving to a given point.
     * @param to The point to move to.
     */
    doMove(to: Vector3): void {
        if (this._movementTween?.active) {
            this._movementTween.kill(false)
        }

        if (this._rotationTween?.active) {
            this._rotationTween.kill(false)
        }

        const distance = this.threeObject.position.distanceTo(to)
        this._movementTween = new Tween<Vector3>({
            duration: (distance / 20) * 5,
            startValue: this.threeObject.position.clone(),
            endValue: to,

            interpolator: (a, b, t) => {
                return new Vector3().lerpVectors(a, b, t)
            },
            onEnd: () => {
                this._animator.play("Armature|Idle")
            },
            onUpdate: value => {
                this.threeObject.position.setX(value.x)
                this.threeObject.position.setY(value.y)
                this.threeObject.position.setZ(value.z)
            }
        })

        this._movementTween.bind(this.game)

        const from = this.threeObject.position.clone()
        const toDir = to.clone().sub(from)
        const targetRotationY = Math.atan2(toDir.x, toDir.z)
        this._rotationTween = new Tween<number>({
            duration: 0.2,
            startValue: this.threeObject.rotation.y,
            endValue: targetRotationY,

            interpolator: (a, b, t) => a + (b - a) * t,
            onUpdate: value => {
                this.threeObject.rotation.y = value
            }
        })

        this._rotationTween.bind(this.game)

        this._animator.play("Armature|Walk")
    }

    /**
     * Does the mouse movement.
     */
    doMouseMovement(): void {
        if (this.game.input.mousePressed) {
            const intersections = this.game.raycast()
            const [object] = intersections
            if (object !== undefined) {
                this.doMove(object.point.clone())
            }
        }
    }

    tick(dt: number): void {
        this._animator?.update(dt)
        this.doMouseMovement()
    }
}
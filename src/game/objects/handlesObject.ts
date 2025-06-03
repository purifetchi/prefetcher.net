import { TransformControls } from "three/examples/jsm/Addons.js";
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import type { Object3D } from "three";

export default class HandlesObject extends GameObject {
    _transformControls? : TransformControls
    _selected? : Object3D

    constructor(opts : GameObjectOptions) {
        super(opts)
    }

    tick(dt: number): void {
        if (!this.game.input.mousePressed) {
            return
        }

        const cast = this.game.raycast()
        if (cast.length > 0) {
            const first = this._transformControls === undefined
            this._transformControls ??= new TransformControls(
                this.game._camera.camera,
                this.game._renderer.domElement)
            if (first) {
                this.threeObject = this._transformControls.getHelper()
                this._attach()
            }

            this._selected = cast[0].object
            this._transformControls.attach(this._selected)
            console.log(`[HandlesObject::tick] ${this._selected} ${this._transformControls}`)
        }
    }
}
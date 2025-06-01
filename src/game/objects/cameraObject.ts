import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";

export default class CameraObject extends GameObject {
    /**
     * The zoom level.
     */
    private _zoom = 6
    
    /**
     * The THREE.JS camera.
     */
    private _camera : OrthographicCamera

    constructor(opts : GameObjectOptions & {
        width: number,
        height: number
    }) {
        super(opts)

        const aspect = opts.width / opts.height
        this._camera = new OrthographicCamera(
            - this._zoom * aspect, this._zoom * aspect, this._zoom, - this._zoom, -10, 1000
        )
        this._camera.position.set(4, 4, 4)
        this._camera.lookAt(new Vector3(0, 0, 0))
    }

    /**
     * Resizes the camera's aspect ratio.
     * @param width The width of the viewport.
     * @param height The height of the viewport.
     */
    resize(width: number, height: number) : void {
        const aspect = width / height
        this._camera.left = -this._zoom * aspect
        this._camera.right = this._zoom * aspect
        this._camera.top = this._zoom
        this._camera.bottom = -this._zoom
        this._camera.updateProjectionMatrix()
    }

    /**
     * Gets the THREE.JS camera.
     */
    get camera() {
        return this._camera
    }
}
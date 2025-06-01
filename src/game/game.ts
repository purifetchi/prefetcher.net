import * as THREE from 'three';
import type GameObject from './objects/gameObject';
import CameraObject from './objects/cameraObject';
import Input from './input';

/**
 * The main class for the game. 
 */
export default class Game {
    /**
     * This game's scene.
     */
    _scene! : THREE.Scene

    /**
     * This game's camera.
     */
    _camera! : CameraObject

    /**
     * The renderer responsible for rendering the scene.
     */
    _renderer! : THREE.WebGLRenderer

    /**
     * The clock used for getting the delta time.
     */
    _clock! : THREE.Clock

    /**
     * The objects within this scene.
     */
    _objects : GameObject[] = []

    /**
     * The raycaster.
     */
    _raycaster! : THREE.Raycaster

    /**
     * The input class.
     */
    _input! : Input

    /**
     * Constructs a new game.
     * @param opts The options to pass for this game.
     */
    constructor(opts: {
        element: HTMLElement
    }) {
        this._setupThree()

        opts.element.appendChild(this._renderer.domElement);
    }

    /**
     * Sets up THREE.JS
     */
    _setupThree() : void {
        this._scene = new THREE.Scene()

        this._camera = new CameraObject({
            width: window.innerWidth,
            height: window.innerHeight
        })
        
        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._renderer.setClearColor(new THREE.Color().setHex(0xffffff))
        this._clock = new THREE.Clock(true);

        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._renderer.setAnimationLoop(this.render.bind(this))

        this._scene.add(new THREE.AmbientLight(new THREE.Color().setHex(0xffffff), 5))

        this._input = new Input()
        this._raycaster = new THREE.Raycaster()

        window.addEventListener('resize', this._resize.bind(this))
    }

    /**
     * Called when the viewport resizes.
     */
    _resize() : void {
        this._camera.resize(window.innerWidth, window.innerHeight)
        this._renderer.setSize(window.innerWidth, window.innerHeight)
    }

    /**
     * Adds a new game object.
     * @param object The object to add.
     */
    addObject<T extends GameObject>(object : T) : T | undefined {
        if (this.getObjectById(object.id) !== undefined) {
            return
        }

        this._objects = [ ...this._objects, object ]
        object.game = this

        if (object.threeObject !== undefined) {
            this._scene.add(object.threeObject)
        }

        return object
    }

    /**
     * Gets an object by its id.
     * @param id The ID.
     */
    getObjectById(id : string) : GameObject | undefined {
        const obj = this._objects.find(o => o.id == id)
        return obj
    }

    /**
     * Removes an object from the scene.
     * @param object The object to remove.
     */
    removeObject(object : GameObject) : void {
        this._objects = this._objects.filter(o => o.id != object.id)
        this._scene.remove(object.threeObject)
        object.destroy()
    }

    /**
     * Casts a ray into the scene and gets the objects that have been intersected with.
     * @returns The list of intersected objects
     */
    raycast() : THREE.Intersection[] {
        const pointer = new THREE.Vector2(
            (this.input.pointerPosition.x / window.innerWidth) * 2 - 1,
            -(this.input.pointerPosition.y / window.innerHeight) * 2 + 1
        )
        this._raycaster.setFromCamera(
            pointer,
            this._camera.camera
        )

        const intersects = this._raycaster.intersectObjects(
            this._scene.children
        )

        return intersects
    }

    /**
     * Gets the input system.
     */
    get input() : Input {
        return this._input
    }

    /**
     * Ticks all the objects and renders the scene.
     */
    render() : void {
        const dt = this._clock.getDelta();
        for (const object of this._objects) {
            object.tick(dt);
        }
        
        this._renderer.render(this._scene, this._camera.camera)
        this._input.reset()
    }
}
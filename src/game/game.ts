import * as THREE from 'three';
import type GameObject from './objects/gameObject';

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
    _camera! : THREE.Camera

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
        this._camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
        this._camera.position.z = 5
        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._clock = new THREE.Clock(true);

        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._renderer.setAnimationLoop(this.render.bind(this))
    }

    /**
     * Adds a new game object.
     * @param object The object to add.
     */
    addObject(object : GameObject) : void {
        this._objects = [ ...this._objects, object ]
        this._scene.add(object.threeObject)
    }

    /**
     * Ticks all the objects and renders the scene.
     */
    render() : void {
        const dt = this._clock.getDelta();
        for (const object of this._objects) {
            object.tick(dt);
        }
        
        this._renderer.render(this._scene, this._camera)
    }
}
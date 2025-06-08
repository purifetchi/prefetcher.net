import type { Object3D } from "three"
import { v4 } from 'uuid' 
import type GameObjectOptions from "./gameObjectOptions"
import type Game from "../game"

/**
 * The base game object.
 */
export default class GameObject {
    /**
     * The ID of this game object.
     */
    id : string

    /**
     * The underlying THREE.JS object.
     */
    threeObject! : Object3D

    /**
     * 
     */
    game! : Game

    /**
     * Does this local player have authority over the object?
     */
    hasAuthority : boolean

    /**
     * Constructs the game object.
     */
    constructor(opts?: GameObjectOptions) {
        this.id = opts?.id ?? v4()
        this.hasAuthority = opts?.hasAuthority ?? false
        console.log(`[GameObject::constructor] Constructed object with id ${this.id} and authority ${this.hasAuthority}`)
    }

    /**
     * Attaches this object to the THREE.JS scene.
     */
    protected _attach() : void {
        this.game._scene.add(this.threeObject)
    }
    
    /**
     * Called when the object gets added to the scene.
     */
    onSceneAdded() : void {

    }

    /**
     * Ticks this object's behavior.
     * @param dt The delta tine.
     */
    tick(dt: number) : void {

    }

    /**
     * Called when the object is being destroyed.
     */
    destroy() : void {

    }
}
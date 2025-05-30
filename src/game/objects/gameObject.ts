import type { Object3D } from "three"
import { v4 } from 'uuid' 
import type GameObjectOptions from "./gameObjectOptions"

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
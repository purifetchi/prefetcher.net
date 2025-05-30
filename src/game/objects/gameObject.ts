import type { Object3D } from "three";

/**
 * The base game object.
 */
export default class GameObject {
    /**
     * The underlying THREE.JS object.
     */
    threeObject! : Object3D

    /**
     * Does this local player have authority over the object?
     */
    hasAuthority : boolean = false
    
    /**
     * Ticks this object's behavior.
     * @param dt The delta tine.
     */
    tick(dt: number) : void {

    }
}
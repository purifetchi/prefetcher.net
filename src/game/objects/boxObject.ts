import GameObject from "./gameObject";
import * as THREE from 'three';
import type GameObjectOptions from "./gameObjectOptions";

export default class BoxObject extends GameObject {
    constructor(opts? : GameObjectOptions) {
        super(opts)

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        this.threeObject = new THREE.Mesh( geometry, material );

        const x = Math.floor(Math.random() * (2 + 2) - 2);
        this.threeObject.position.x = x
    }

    tick(dt: number): void {
        if (this.hasAuthority) {
            return
        }

        this.threeObject.rotateY(3 * dt);
        this.threeObject.rotateX(2 * dt);
    }

    destroy(): void {
        console.log("[BoxObject::destroy] I'm being destroyed.")
    }
}
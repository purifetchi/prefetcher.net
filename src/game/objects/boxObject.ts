import GameObject from "./gameObject";
import * as THREE from 'three';

export default class BoxObject extends GameObject {
    constructor() { 
        super()

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        this.threeObject = new THREE.Mesh( geometry, material );

        const x = Math.floor(Math.random() * (2 + 2) - 2);
        this.threeObject.position.x = x
    }

    tick(dt: number): void {
        this.threeObject.rotateY(3 * dt);
        this.threeObject.rotateX(2 * dt);
    }
}
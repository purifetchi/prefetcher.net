import { TransformControls } from "three/examples/jsm/Addons.js";
import { GUI } from 'dat.gui';
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import type { Object3D } from "three";

export default class HandlesObject extends GameObject {
    _transformControls? : TransformControls
    _selected? : Object3D
    _gui! : GUI

    constructor(opts : GameObjectOptions) {
        super(opts)
    }
    
    private buildGui() : void {
        this._gui = new GUI()
        
        const scene = this.game._scene
        const selectableObjects = {}
        scene.traverse(obj => {
            const label = obj.name || obj.uuid;
            selectableObjects[label] = obj;
        })

        const state = {
            selectedObject: Object.keys(selectableObjects)[0]
        }

        console.log(state)

        this._gui.add(state, 'selectedObject', Object.keys(selectableObjects))
        .name("Select Object")
        .onChange((selected) => {
            const obj = selectableObjects[selected];
            console.log("Selected object:", obj);
            const folder = this._gui.addFolder(`${selected} Transform`);
            folder.add(obj.rotation, 'x', 0, Math.PI * 2);
            folder.add(obj.rotation, 'y', 0, Math.PI * 2);
            folder.add(obj.rotation, 'z', 0, Math.PI * 2);

            this.setHandlesObject(selected)
        })

        this.game.eventStream.on('objectAdded', object => {
            console.log("hi")
            selectableObjects[object.threeObject?.name ?? object.id] = object.threeObject
            console.log(selectableObjects)
        })
    }

    private setHandlesObject(object: Object3D) {
        const first = this._transformControls === undefined
        this._transformControls ??= new TransformControls(
            this.game._camera.camera,
            this.game._renderer.domElement)
        if (first) {
            this.threeObject = this._transformControls.getHelper()
            this._attach()
        }

        this._selected = object
        this._transformControls.attach(this._selected)
        console.log(`[HandlesObject::setHandlesObject] ${this._selected.name} ${this._transformControls}`)
    }

    onSceneAdded(): void {
        this.buildGui()
    }
}
import { TransformControls } from "three/examples/jsm/Addons.js";
import { GUI } from 'dat.gui';
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import type { Object3D } from "three";

export default class HandlesObject extends GameObject {
    _transformControls? : TransformControls
    _selected? : Object3D
    _gui! : GUI

    _selectedObjectController? : dat.GUIController

    constructor(opts : GameObjectOptions) {
        super(opts)
    }
    
    private buildGui() : void {
        this._transformControls = new TransformControls(
            this.game._camera.camera,
            this.game._renderer.domElement)
        this.threeObject = this._transformControls.getHelper()
        this._attach()

        this._gui = new GUI()
        
        this.buildObjectSelector()
        
        this.game.eventStream.on('objectAdded', object => {
            if (object.threeObject === undefined) {
                const cleanup = object.eventStream.on('attached', () => {
                    this.buildObjectSelector()
                    cleanup()
                })
            } else {
                this.buildObjectSelector()
            }
        })
    }

    private buildObjectSelector() : void {
        if (this._selectedObjectController !== undefined) {
            this._gui.remove(this._selectedObjectController)
        }

        const scene = this.game._scene
        const selectableObjects: { [key: string]: Object3D } = {}
        scene.traverse(obj => {
            const label = obj.name || obj.uuid;
            selectableObjects[label] = obj;
        })

        const state = {
            selectedObject: Object.keys(selectableObjects)[0]
        }

        this._selectedObjectController = this._gui.add(state, 'selectedObject', Object.keys(selectableObjects))
            .name("Select Object")
            .onChange((selected: string) => {
                const obj = selectableObjects[selected];
                const folder = this._gui.addFolder(`${selected} Transform`);
                folder.add(obj.rotation, 'x', 0, Math.PI * 2);
                folder.add(obj.rotation, 'y', 0, Math.PI * 2);
                folder.add(obj.rotation, 'z', 0, Math.PI * 2);

                this.setHandlesObject(obj)
            })
    }

    private setHandlesObject(object: Object3D) {
        this._selected = object
        this._transformControls?.attach(this._selected)
        console.log(`[HandlesObject::setHandlesObject] ${this._selected.name} ${this._transformControls}`)
    }

    onSceneAdded(): void {
        this.buildGui()
    }
}
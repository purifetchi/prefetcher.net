import { TransformControls } from "three/examples/jsm/Addons.js";
import { GUI } from 'dat.gui';
import GameObject from "./gameObject";
import type GameObjectOptions from "./gameObjectOptions";
import { Vector3, type Object3D } from "three";
import ModelObject from "./modelObject";

export default class HandlesObject extends GameObject {
    _transformControls? : TransformControls
    _selected? : Object3D
    _gui! : GUI

    _modelName : string = ""

    _selectedObjectController? : dat.GUIController
    _contextualEditorController? : GUI

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

        this.buildObjectCreator()
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

    private buildObjectCreator() : void {
        const folder = this._gui.addFolder("Add an object")

        folder.add(this, '_modelName')
            .name("Path to model")
        folder.add({
            add: () => {
                this.game.addObject(new ModelObject({
                    path: this._modelName,
                    position: new Vector3(0, 0, 0),
                    rotation: new Vector3(0, 0, 0),
                    scale: new Vector3(1, 1, 1)
                }))
            }
        }, "add").name("Add object")
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
                this.setHandlesObject(obj)
                this.buildObjectContextualEditor(obj)
            })
    }

    private buildObjectContextualEditor(object: Object3D) : void {
        if (this._contextualEditorController !== undefined) {
            this._gui.removeFolder(this._contextualEditorController)
        }

        const folder = this._gui.addFolder(`${object.name ?? object.uuid} Transform`);
        folder.add(object.position, 'x')
            .name("Position X");
        folder.add(object.position, 'y')
            .name("Position Y");
        folder.add(object.position, 'z')
            .name("Position Z");

        folder.add(object.rotation, 'x', 0, Math.PI * 2)
            .name("Rotation X");
        folder.add(object.rotation, 'y', 0, Math.PI * 2)
            .name("Rotation Y");
        folder.add(object.rotation, 'z', 0, Math.PI * 2)
            .name("Rotation Z");

        folder.add(object.scale, 'x')
            .name("Scale X");
        folder.add(object.scale, 'y')
            .name("Scale Y");
        folder.add(object.scale, 'z')
            .name("Scale Z");
        
        this._contextualEditorController = folder
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
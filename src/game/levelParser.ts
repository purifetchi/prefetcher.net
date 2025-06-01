import { MathUtils, Vector3 } from "three";
import type Game from "./game";
import type Level from "./level/level";
import ModelObject from "./objects/modelObject";

/**
 * The level parser.
 */
export default class LevelParser {
    /**
     * The game to load the entities to.
     */
    private _game : Game

    /**
     * Constructs a new level parser for a game.
     * @param game The game.
     */
    constructor(game: Game) {
        this._game = game
    }

    /**
     * Loads a level.
     * @param level The level
     */
    load(level: Level) : void {
        for (const ent of level.ents) {
            if (ent.type !== "model") {
                console.error("[LevelPArser::load] Unknown entity type!")
                return
            }

            const model = new ModelObject({
                id: ent.id,
                path: ent.path,
                scale: new Vector3(ent.scale[0], ent.scale[1], ent.scale[2]),
                position: new Vector3(ent.position[0], ent.position[1], ent.position[2]),
                rotation: new Vector3(
                    MathUtils.degToRad(ent.rotation[0]),
                    MathUtils.degToRad(ent.rotation[1]),
                    MathUtils.degToRad(ent.rotation[2])
                )
            })

            this._game.addObject(model)
        }
    }
}
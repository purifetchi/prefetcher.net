import type { Vector3 } from "three";
import type Game from "../game";

export default interface GameObjectOptions {
    id? : string | undefined,
    hasAuthority? : boolean | undefined,
}
/**
 * A single entity
 */
export default interface Entity {
    id?: string | undefined,
    type: string,
    path: string,
    scale: number[],
    position: number[],
    rotation: number[]
}
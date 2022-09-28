import { Grid } from '../core/grid';
import { IAStarFinderConstructor, IPoint } from '../interfaces/astar.interfaces';
import { Node } from '../core/node';
import { Heuristic } from '../types/astar.types';
export declare class AStarFinder {
    private grid;
    private closedList;
    private openList;
    readonly diagonalAllowed: boolean;
    private heuristic;
    readonly includeStartNode: boolean;
    readonly includeEndNode: boolean;
    private weight;
    constructor(aParams: IAStarFinderConstructor);
    findPath(startPosition: IPoint, endPosition: IPoint): number[][];
    /**
     * Set the heuristic to be used for pathfinding.
     * @param newHeuristic
     */
    setHeuristic(newHeuristic: Heuristic): void;
    /**
     * Set the weight for the heuristic function.
     * @param newWeight
     */
    setWeight(newWeight: number): void;
    /**
     * Get a copy/clone of the grid.
     */
    getGridClone(): Node[][];
    /**
     * Get the current grid
     */
    getGrid(): Grid;
}

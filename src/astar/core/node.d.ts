import { INodeConstructor, IPoint } from '../interfaces/astar.interfaces';
export declare class Node {
    readonly id: number;
    readonly position: IPoint;
    private fValue;
    private gValue;
    private hValue;
    private parentNode;
    private isOnClosedList;
    private isOnOpenList;
    private isWalkable;
    constructor(aParams: INodeConstructor);
    /**
     * Calculate or Recalculate the F value
     * This is a private function
     */
    private calculateFValue;
    /**
     * Set the g value of the node
     */
    setGValue(gValue: number): void;
    /**
     * Set the h value of the node
     */
    setHValue(hValue: number): void;
    /**
     * Reset the FGH values to zero
     */
    setFGHValuesToZero(): void;
    /**
     * Getter functions
     */
    getFValue(): number;
    getGValue(): number;
    getHValue(): number;
    getParent(): Node;
    getIsOnClosedList(): boolean;
    getIsOnOpenList(): boolean;
    getIsWalkable(): boolean;
    /**
     * Setter functions
     */
    setParent(parent: Node): void;
    setIsOnClosedList(isOnClosedList: boolean): void;
    setIsOnOpenList(isOnOpenList: boolean): void;
    setIsWalkable(isWalkable: boolean): void;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor(aParams) {
        this.id = aParams.id;
        this.position = aParams.position;
        this.hValue = 0;
        this.gValue = 0;
        this.fValue = 0;
        this.parentNode = undefined;
        this.isOnClosedList = false;
        this.isOnOpenList = false;
        this.isWalkable = aParams.walkable || true;
    }
    /**
     * Calculate or Recalculate the F value
     * This is a private function
     */
    calculateFValue() {
        this.fValue = this.gValue + this.hValue;
    }
    /**
     * Set the g value of the node
     */
    setGValue(gValue) {
        this.gValue = gValue;
        // The G value has changed, so recalculate the f value
        this.calculateFValue();
    }
    /**
     * Set the h value of the node
     */
    setHValue(hValue) {
        this.hValue = hValue;
        // The H value has changed, so recalculate the f value
        this.calculateFValue();
    }
    /**
     * Reset the FGH values to zero
     */
    setFGHValuesToZero() {
        this.fValue = this.gValue = this.hValue = 0;
    }
    /**
     * Getter functions
     */
    getFValue() {
        return this.fValue;
    }
    getGValue() {
        return this.gValue;
    }
    getHValue() {
        return this.hValue;
    }
    getParent() {
        return this.parentNode;
    }
    getIsOnClosedList() {
        return this.isOnClosedList;
    }
    getIsOnOpenList() {
        return this.isOnOpenList;
    }
    getIsWalkable() {
        return this.isWalkable;
    }
    /**
     * Setter functions
     */
    setParent(parent) {
        this.parentNode = parent;
    }
    setIsOnClosedList(isOnClosedList) {
        this.isOnClosedList = isOnClosedList;
    }
    setIsOnOpenList(isOnOpenList) {
        this.isOnOpenList = isOnOpenList;
    }
    setIsWalkable(isWalkable) {
        this.isWalkable = isWalkable;
    }
}
exports.Node = Node;

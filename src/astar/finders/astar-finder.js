"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AStarFinder = void 0;
const lodash_1 = require("lodash");
const util_1 = require("../core/util");
const heuristic_1 = require("../core/heuristic");
const grid_1 = require("../core/grid");
class AStarFinder {
    constructor(aParams) {
        // Create grid
        this.grid = new grid_1.Grid({
            width: aParams.grid.width,
            height: aParams.grid.height,
            matrix: aParams.grid.matrix || undefined,
            densityOfObstacles: aParams.grid.densityOfObstacles || 0
        });
        // Init lists
        this.closedList = [];
        this.openList = [];
        // Set diagonal boolean
        this.diagonalAllowed =
            aParams.diagonalAllowed !== undefined ? aParams.diagonalAllowed : true;
        // Set heuristic function
        this.heuristic = aParams.heuristic ? aParams.heuristic : 'Manhattan';
        // Set if start node included
        this.includeStartNode =
            aParams.includeStartNode !== undefined ? aParams.includeStartNode : true;
        // Set if end node included
        this.includeEndNode =
            aParams.includeEndNode !== undefined ? aParams.includeEndNode : true;
        // Set weight
        this.weight = aParams.weight || 1;
    }
    
    findPath(startPosition, endPosition, failPositions = []) {
        // Reset lists
        this.closedList = [];
        this.openList = [];
        // Reset grid
        this.grid.resetGrid();
        const startNode = this.grid.getNodeAt(startPosition);
        const endNode = this.grid.getNodeAt(endPosition);
        // Break if start and/or end position is/are not walkable
        if (!this.grid.isWalkableAt(endPosition) ||
            !this.grid.isWalkableAt(startPosition)) {
            // Path could not be created because the start and/or end position is/are not walkable.
            return [];
        }
        // Push start node into open list
        startNode.setIsOnOpenList(true);
        this.openList.push(startNode);
        // Loop through the grid
        // Set the FGH values of non walkable nodes to zero and push them on the closed list
        // Set the H value for walkable nodes
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                let node = this.grid.getNodeAt({ x, y });
                if (!this.grid.isWalkableAt({ x, y })) {
                    // OK, this node is not walkable
                    // Set FGH values to zero
                    node.setFGHValuesToZero();
                    // Put on closed list
                    node.setIsOnClosedList(true);
                    this.closedList.push(node);
                }
                else {
                    // OK, this node is walkable
                    // Calculate the H value with the corresponding heuristic function
                    node.setHValue(heuristic_1.calculateHeuristic(this.heuristic, node.position, endNode.position, this.weight));
                }
            }
        }
        // As long the open list is not empty, continue searching a path
        let isFirst = true;
        let firstNeighborsCount = 0;
        let neighborsCount = 0;
        let failPositionCandidate = null;
        while (this.openList.length !== 0) {
            // Get node with lowest f value
            const currentNode = lodash_1.minBy(this.openList, (o) => {
                return o.getFValue();
            });
            if (currentNode.getParent() !== undefined && isFirst) {
                isFirst = false;
                failPositionCandidate = currentNode.position;
            }
            
            // Move current node from open list to closed list
            currentNode.setIsOnOpenList(false);
            lodash_1.remove(this.openList, currentNode);
            currentNode.setIsOnClosedList(true);
            this.closedList.push(currentNode);
            // End of path is reached
            if (currentNode === endNode) {
                const resultArr = util_1.backtrace(endNode, this.includeStartNode, this.includeEndNode);
                if (resultArr.length === 0 && failPositions.length < firstNeighborsCount) {
                    return this.findPath(startPosition, endPosition, [...failPositions, failPositionCandidate]);
                }
                return resultArr; 
            }
            // Get neighbors
            const neighbors = this.grid.getSurroundingNodes(currentNode.position, this.diagonalAllowed);
            // Loop through all the neighbors
            for (let i in neighbors) {
                const neightbor = neighbors[i];
                // Continue if node on closed list
                if (neightbor.getIsOnClosedList()) {
                    continue;
                }

                if (firstNeighborsCount === 0) neighborsCount++;

                // ????????? ????????? ??? ??? ????????? ???????????????
                let turnValue = 0;
                if (currentNode.getParent() !== undefined) {
                    if (util_1.isChangeDirection(currentNode.getParent(), currentNode, neightbor)) turnValue += 500;
                }

                // Calculate the g value of the neightbor
                let failValue = 0;
                failPositions.some((failPosition) => {
                    if (neightbor.position.x === failPosition.x && neightbor.position.y === failPosition.y) {
                        failValue = 500;
                        return;
                    }
                });

                const nextGValue = currentNode.getGValue() + turnValue + failValue +
                    (neightbor.position.x !== currentNode.position.x ||
                        neightbor.position.y == currentNode.position.y
                        ? this.weight
                        : this.weight * 1.41421);
                // Is the neighbor not on open list OR
                // can it be reached with lower g value from current position
                if (!neightbor.getIsOnOpenList() ||
                    nextGValue < neightbor.getGValue()) {
                    neightbor.setGValue(nextGValue);
                    neightbor.setParent(currentNode);
                    if (!neightbor.getIsOnOpenList()) {
                        neightbor.setIsOnOpenList(true);
                        this.openList.push(neightbor);
                    }
                    else {
                        // okay this is a better way, so change the parent
                        neightbor.setParent(currentNode);
                    }
                }
            }
            if (firstNeighborsCount === 0) firstNeighborsCount = neighborsCount;
        }
        // Path could not be created
        return [];
    }
    /**
     * Set the heuristic to be used for pathfinding.
     * @param newHeuristic
     */
    setHeuristic(newHeuristic) {
        this.heuristic = newHeuristic;
    }
    /**
     * Set the weight for the heuristic function.
     * @param newWeight
     */
    setWeight(newWeight) {
        this.weight = newWeight;
    }
    /**
     * Get a copy/clone of the grid.
     */
    getGridClone() {
        return this.grid.clone();
    }
    /**
     * Get the current grid
     */
    getGrid() {
        return this.grid;
    }
}
exports.AStarFinder = AStarFinder;

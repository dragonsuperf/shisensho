"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChangeDirection = void 0;
exports.backtrace = void 0;
/**
 * Backtrace from end node through parents and return the path.
 * @param node
 * @param includeStartingNode
 */

function isChangeDirection(grandParent, parent, current) {
    const prevDirection = grandParent.position.x === parent.position.x ? 'vertical' : 'horizontal';
    const currDirection = parent.position.x === current.position.x ? 'vertical' : 'horizontal';

    return prevDirection !== currDirection;
}

function backtrace(node, includeStartNode, includeEndNode) {
    // Init empty path
    const path = [];
    let currentNode;
    let turnCount = 0;
    if (includeEndNode) {
        // Attach the end node to be the current node
        currentNode = node;
    }
    else {
        currentNode = node.getParent();
    }
    // Loop as long the current node has a parent
    while (currentNode.getParent()) {
        path.push([currentNode.position.x, currentNode.position.y]);
        if (currentNode.getParent() !== undefined) {
            if (currentNode.getParent().getParent() !== undefined) {
                if (isChangeDirection(currentNode.getParent().getParent(), currentNode.getParent(), currentNode)) turnCount++;
            }
        }

        if (turnCount > 2) return [];
        currentNode = currentNode.getParent();
    }
    // If true we will also include the starting node
    if (includeStartNode) {
        path.push([currentNode.position.x, currentNode.position.y]);
    }
    return path.reverse();
}
exports.isChangeDirection = isChangeDirection;
exports.backtrace = backtrace;

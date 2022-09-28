/**
 * Resources:
 * http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
 * https://en.wikipedia.org/wiki/Taxicab_geometry
 * https://en.wikipedia.org/wiki/Euclidean_distance
 * https://en.wikipedia.org/wiki/Chebyshev_distance
 * http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter17_Pathfinding_Architecture_Optimizations.pdf
 * https://github.com/riscy/a_star_on_grids#heuristics
 */
import { Heuristic } from '../types/astar.types';
/**
 * Calculate for two positions the heuristic function.
 * @param heuristicFunction
 * @param pos0
 * @param pos1
 * @param weight
 */
export declare function calculateHeuristic(heuristicFunction: Heuristic, pos0: any, pos1: any, weight: any): number;

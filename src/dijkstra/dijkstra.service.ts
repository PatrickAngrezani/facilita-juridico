import { Injectable } from '@nestjs/common';

@Injectable()
export class DijkstraService {
  dijkstra(points: { x: number; y: number }[]) {
    Array(points.length).fill(Number.MAX_VALUE);
    const visited = new Set();

    const orderOfVisits = [];
    let nextDistance;
    let nextPoint;

    // Check coordinate (0, 0) is present
    this.checkInitialCoordinate(points);

    let currentPoint = points.findIndex(
      (point) => point.x === 0 && point.y === 0,
    );

    let currentDistance = 0;

    while (visited.size < points.length) {
      visited.add(currentPoint);
      orderOfVisits.push(points[currentPoint]);

      if (visited.size === points.length - 1) {
        nextPoint = points.findIndex((point) => point.x === 0 && point.y === 0);
        currentDistance += nextDistance;
        orderOfVisits.push(points[nextPoint]);
        break;
      } else {
        // Find next nearest point
        nextPoint = -1;
        nextDistance = Number.MAX_VALUE;

        for (let i = 0; i < points.length; i++) {
          if (!visited.has(i)) {
            const distance = Math.sqrt(
              Math.pow(points[currentPoint].x - points[i].x, 2) +
                Math.pow(points[currentPoint].y - points[i].y, 2),
            );

            if (distance < nextDistance) {
              nextPoint = i;
              nextDistance = distance;
            }
          }
        }
      }

      //Update total distance
      currentDistance += nextDistance;

      if (nextPoint !== -1) {
        currentPoint = nextPoint;
      }
    }

    return { totalDistance: currentDistance.toFixed(2), orderOfVisits };
  }

  checkInitialCoordinate(points: { x: number; y: number }[]) {
    if (!points.some((point) => point.x === 0 && point.y === 0)) {
      points.push({ x: 0, y: 0 });
    }
  }
}

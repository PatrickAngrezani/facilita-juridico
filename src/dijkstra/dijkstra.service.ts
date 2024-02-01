import { Injectable } from '@nestjs/common';

@Injectable()
export class DijkstraService {
  dijkstra(points: { id: string; name: string; x: number; y: number }[]) {
    const visited = new Set();
    const orderOfVisits = [];
    let nextPoint;
    let id: string;
    let name: string;

    // Check coordinate (0, 0) is present
    this.checkInitialCoordinate(points);

    let currentPoint = points.findIndex(
      (point) => point.x === 0 && point.y === 0,
    );

    let currentDistance = 0;

    while (visited.size < points.length) {
      visited.add(currentPoint);
      orderOfVisits.push(points[currentPoint]);

      // Find next nearest point
      nextPoint = -1;
      let nextDistance = Number.MAX_VALUE;

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

      // Update total distance only if a valid next point is found
      if (nextPoint !== -1 && nextDistance !== Number.MAX_VALUE) {
        currentDistance += nextDistance;
        currentPoint = nextPoint;
      }
    }

    // Add point to come back company
    orderOfVisits.push({ x: 0, y: 0 });

    for (const point of points) {
      id = point.id;
      name = point.name;
    }

    return {
      id,
      name,
      totalDistance: currentDistance.toFixed(2),
      orderOfVisits,
    };
  }

  checkInitialCoordinate(points: { x: number; y: number }[]) {
    if (!points.some((point) => point.x === 0 && point.y === 0)) {
      points.push({ x: 0, y: 0 });
    }
  }
}

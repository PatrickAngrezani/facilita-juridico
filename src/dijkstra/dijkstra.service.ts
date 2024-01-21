import { Injectable } from '@nestjs/common';

@Injectable()
export class DijkstraService {
  dijkstra(points: { x: number; y: number }[]) {
    Array(points.length).fill(Number.MAX_VALUE);
    const visited = new Set();

    let nextDistance;
    let nextPoint;

    // Certifique-se de que o ponto (0, 0) está presente
    if (!points.some((point) => point.x === 0 && point.y === 0)) {
      points.push({ x: 0, y: 0 });
    }

    let currentPoint = points.findIndex(
      (point) => point.x === 0 && point.y === 0,
    );

    let currentDistance = 0;

    while (visited.size < points.length) {
      visited.add(currentPoint);

      if (visited.size === points.length - 1) {
        nextPoint = points.findIndex((point) => point.x === 0 && point.y === 0);
        currentDistance += nextDistance;
        break;
      } else {
        // Encontre o próximo ponto mais próximo
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

      // Atualize a distância total e mude para o próximo ponto mais próximo
      currentDistance += nextDistance;

      if (nextPoint !== -1) {
        currentPoint = nextPoint;
      }
    }

    return Number(currentDistance);
  }
}

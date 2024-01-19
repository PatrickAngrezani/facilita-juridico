export class Client {
  constructor(public id: any, public x: number, public y: number) {}

  distanceTo(client: Client) {
    const dx = this.x - client.x;
    const dy = this.y - client.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }
}

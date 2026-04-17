import java.util.ArrayList;

public class Simulation {
    private static final double G = 1; // for now because scale is small
    private final ArrayList<CelestialBody> celestialBodies;

    public Simulation() {
        celestialBodies = new ArrayList<>();
        celestialBodies.add(new CelestialBody(400, 400, 0, 0, 1000, 30));
        celestialBodies.add(new CelestialBody(500, 400, 0, 3, 10, 8));
        celestialBodies.add(new CelestialBody(325, 400, 0, 3, 10, 8));
    }

    public ArrayList<CelestialBody> getCelestialBodies() {
        return celestialBodies;
    }

    public void updatePositions() {

        double dt = 1.0 / 60;
        for (CelestialBody body : celestialBodies) {
            double totalAccX = 0;
            double totalAccY = 0;

            for (CelestialBody otherBody : celestialBodies) {
                if (otherBody != body) {
                    double distanceX = otherBody.x - body.x;
                    double distanceY = otherBody.y - body.y;
                    double totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                    double directionX = distanceX / totalDistance;
                    double directionY = distanceY / totalDistance;

                    double forceOfGravity = (G * otherBody.mass * body.mass) / (totalDistance * totalDistance);

                    double accx = directionX * forceOfGravity / body.mass;
                    double accy = directionY * forceOfGravity / body.mass;

                    totalAccX += accx;
                    totalAccY += accy;
                }
            }

            body.vx += totalAccX * dt;
            body.vy += totalAccY * dt;

        }

        for (CelestialBody body : celestialBodies) {
            body.x += body.vx * dt;
            body.y += body.vy * dt;
        }
        

    }
    public void start() {
        System.out.println("Yo first line");
    }
}

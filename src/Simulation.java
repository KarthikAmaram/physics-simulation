import java.util.ArrayList;

public class Simulation {
    private static final double G = 1; // for now because scale is small
    private final ArrayList<CelestialBody> celestialBodies;

    public Simulation() {
        celestialBodies = new ArrayList<>();
        celestialBodies.add(new CelestialBody(0, 0, 0, 0, 1000, 30));
        celestialBodies.add(new CelestialBody(100, 0, 0, 3, 10, 8));
    }

    public ArrayList<CelestialBody> getCelestialBodies() {
        return celestialBodies;
    }

    public void updatePositions() {
        CelestialBody sun = celestialBodies.get(0);
        CelestialBody planet = celestialBodies.get(1);
        double dt = 1.0 / 60;
        double distanceX = sun.x - planet.x;
        double distanceY = sun.y - planet.y;
        double totalDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        if (totalDistance == 0) return;

        double directionX = distanceX / totalDistance;
        double directionY = distanceY / totalDistance;
        double forceOfGravity = (G * sun.mass * planet.mass) / Math.pow(totalDistance, 2);

        double accx = directionX * forceOfGravity / planet.mass;
        double accy = directionY * forceOfGravity / planet.mass;

        planet.vx += accx * dt;
        planet.vy += accy * dt;

        planet.x += planet.vx * dt;
        planet.y += planet.vy * dt;

    }
    public void start() {
        System.out.println("Yo first line");
    }
}

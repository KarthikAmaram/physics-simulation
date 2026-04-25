import java.awt.*;
import java.util.ArrayList;

public class Simulation {
    private static final double G = 5;
    private final ArrayList<CelestialBody> celestialBodies;
    public static final int MASS_OF_SUN = 1000;
    private static final int MAX_LENGTH = 1000;

    private int frameCount;

    public Simulation() {
        celestialBodies = new ArrayList<>();
        celestialBodies.add(new CelestialBody(400, 400, 0, 0, MASS_OF_SUN, 30));
        celestialBodies.add(new CelestialBody(500, 400, 0, 7.07, 10, 8));
        celestialBodies.add(new CelestialBody(300, 400, 0, -8.16, 10, 8));
    }

    public ArrayList<CelestialBody> getCelestialBodies() {
        return celestialBodies;
    }

    public void updatePositions() {
        double dt = 1.0 / 60;
        frameCount++;
        for (CelestialBody body : celestialBodies) {
            double totalAccX = 0;
            double totalAccY = 0;

            for (CelestialBody otherBody : celestialBodies) {
                if (otherBody != body) {
                    double dx = otherBody.x - body.x;
                    double dy = otherBody.y - body.y;
                    double distSq = dx * dx + dy * dy;
                    double dist = Math.sqrt(distSq);

                    if (dist < 1) continue;

                    double force = (G * otherBody.mass) / distSq;

                    totalAccX += (dx / dist) * force;
                    totalAccY += (dy / dist) * force;
                }
            }

            body.vx += totalAccX * dt;
            body.vy += totalAccY * dt;
        }

        for (CelestialBody body : celestialBodies) {
            if (frameCount % 5 == 0) {
                body.prevPoints.add(new Point((int) body.x, (int) body.y));

                if (body.prevPoints.size() > MAX_LENGTH) {
                    body.prevPoints.poll();
                }
            }
            body.x += body.vx * dt;
            body.y += body.vy * dt;
        }
    }
    public void createPlanet(double x, double y, double vx, double vy, double mass, double radius) {
        celestialBodies.add(new CelestialBody(x, y, vx, vy, mass, radius));
    }
    public void addPlanet(int height, int width) {
        boolean valid = false;
        mainLoop:
        while (!valid) {
            int randR = (int) (Math.random() * 6) + 5;
            int randX = (int) (Math.random() * (width - 2 * randR)) + randR;
            int randY = (int) (Math.random() * (height - 2 * randR)) + randR;

            for (CelestialBody body : celestialBodies) {
                double dx = body.x - randX;
                double dy = body.y - randY;
                double distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (body.radius + randR + 15)) {
                    continue mainLoop;
                }
            }

            valid = true;

            double dx = randX - 400;
            double dy = randY - 400;
            double r = Math.sqrt(dx * dx + dy * dy);

            double speed = Math.sqrt((G * MASS_OF_SUN) / r);
            speed *= (0.8 + Math.random() * 0.4);

            double vx = (-dy / r) * speed;
            double vy = (dx / r) * speed;

            if (Math.random() < 0.5) {
                vx *= -1;
                vy *= -1;
            }

            double randMass = Math.random() * 5 + 5;
            celestialBodies.add(new CelestialBody(randX, randY, vx, vy, randMass, randR));
        }
    }
}
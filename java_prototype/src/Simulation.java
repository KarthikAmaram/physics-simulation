import java.awt.*;
import java.util.ArrayList;

public class Simulation {
    public static final double G = 5;
    private final ArrayList<CelestialBody> celestialBodies;
    public static final int MASS_OF_SUN = 50000;
    private static final int MAX_LENGTH = 500;
    private final ArrayList<CelestialBody> toRemove = new ArrayList<>();
    private int frameCount;

    public Simulation() {
        celestialBodies = new ArrayList<>();
        celestialBodies.add(new CelestialBody(400, 400, 0, 0, MASS_OF_SUN, 30));
        celestialBodies.add(new CelestialBody(500, 400, 0, 50, 10, 8));
        celestialBodies.add(new CelestialBody(300, 400, 0, -58, 10, 8));
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
                    if (dist < (body.radius + otherBody.radius)) {
                        if (!(toRemove.contains(otherBody))) {
                            if (body.mass * (Math.sqrt(body.vx * body.vx + body.vy * body.vy)) >
                                    otherBody.mass * (Math.sqrt(otherBody.vx * otherBody.vx + otherBody.vy * otherBody.vy)) )
                                toRemove.add(otherBody);
                            else
                                toRemove.add(body);

                        }
                    }
                    double accel = (G * otherBody.mass) / distSq;

                    totalAccX += (dx / dist) * accel;
                    totalAccY += (dy / dist) * accel;
                }
            }

            body.vx += totalAccX * dt;
            body.vy += totalAccY * dt;

            if (Math.abs(body.x) > 2000 || Math.abs(body.y) > 2000) {
                toRemove.add(body);
            }


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

        removeAll();
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

    private void removeAll() {
        celestialBodies.removeAll(toRemove);
        toRemove.clear();
    }
}
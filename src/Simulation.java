import java.util.ArrayList;

public class Simulation {
    private static final double G = Math.pow(6.67, -11);
    private ArrayList<CelestialBody> celestialBodies;

    public Simulation() {
        celestialBodies = new ArrayList<>();
    }

    public ArrayList<CelestialBody> getCelestialBodies() {
        return celestialBodies;
    }
    public void start() {
        System.out.println("Yo first line");
    }
}

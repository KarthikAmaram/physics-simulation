import javax.swing.*;
import java.awt.*;

public class Renderer extends JPanel {
    private Simulation sim;
;

    public Renderer(Simulation obj) {
        sim = obj;
        new Timer(16, e -> {
            sim.updatePositions();
            repaint();
        }).start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        for (CelestialBody body : sim.getCelestialBodies())
        {
            g.fillOval((int) (body.x - body.radius), (int) (body.y - body.radius), (int) body.radius, (int) body.radius);
        }

    }

}

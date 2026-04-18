import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import javax.swing.*;

public class Renderer extends JPanel {
    private Simulation sim;


    public Renderer(Simulation obj) {
        sim = obj;
        setLayout(new BorderLayout());
        setBorder(new EmptyBorder(10, 15, 10, 15));

        JPanel buttonContainer = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        buttonContainer.setOpaque(false);

        JButton addPlanetButton = new JButton("Add Planet");
        buttonContainer.add(addPlanetButton);

        this.add(buttonContainer, BorderLayout.SOUTH);


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
            g.fillOval((int) (body.x - body.radius), (int) (body.y - body.radius), (int) (body.radius * 2),
                    (int) (body.radius * 2));
        }

    }


}

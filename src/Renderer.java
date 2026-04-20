import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
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

        addPlanetButton.addActionListener(this::addPlanet);

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
            Point lastPoint = null;
            for (Point p : body.prevPoints) {
                if (lastPoint != null) {
                    g.drawLine(lastPoint.x, lastPoint.y, p.x, p.y);
                    lastPoint = p;
                }
                else {
                    lastPoint = p;
                }
            }
            g.fillOval((int) (body.x - body.radius), (int) (body.y - body.radius), (int) (body.radius * 2),
                    (int) (body.radius * 2));

        }

    }

    private void addPlanet(ActionEvent e) {
        sim.addPlanet(getHeight(), getWidth());
    }

}

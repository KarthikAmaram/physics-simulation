import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.*;

public class Renderer extends JPanel {
    private Simulation sim;
    private Point startPoint;
    private Point endPoint;
    private Point currentPoint;

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

        this.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                System.out.println("Start: " + e.getX() + ", " + e.getY());
                startPoint = new Point(e.getX(), e.getY());
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                System.out.println("End: " + e.getX() + ", " + e.getY());
                endPoint = new Point(e.getX(), e.getY());
                int dx = startPoint.x - endPoint.x;
                int dy = startPoint.y - endPoint.y;
//                System.out.println("Velocity X would be: " + (startPoint.x - endPoint.x));
//                System.out.println("Velocity Y would be: " + (startPoint.y - endPoint.y));

                double vx = dx * .1;
                double vy = dy * .1;

                sim.createPlanet(startPoint.x, startPoint.y, vx, vy, 10, 8);
                startPoint = null;
                currentPoint = null;

                repaint();
            }
        });

        this.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                currentPoint = e.getPoint();
                repaint();
            }
        });
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

        if (startPoint != null && currentPoint != null) {
            g.setColor(Color.blue);

            g.drawLine(startPoint.x, startPoint.y, currentPoint.x, currentPoint.y);

            g.drawOval(startPoint.x - 8, startPoint.y - 8, 8 * 2, 8 * 2);

            double ghostX = startPoint.x;
            double ghostY = startPoint.y;

            double ghostVX = (startPoint.x - currentPoint.x) * 0.1;
            double ghostVY = (startPoint.y - currentPoint.y) * 0.1;

            double dt = 1.0 / 60;

            g.setColor(new Color(255, 120, 0, 180));;


            for (int i = 0; i < 1000; i++) {
                double totalAccX = 0;
                double totalAccY = 0;

                for (CelestialBody otherBody : sim.getCelestialBodies()) {
                    double dx = otherBody.x - ghostX;
                    double dy = otherBody.y - ghostY;
                    double distSq = dx * dx + dy * dy;
                    double dist = Math.sqrt(distSq);

                    if (dist < 5) continue;

                    double force =  (Simulation.G * otherBody.mass) / distSq;
                    totalAccX += (dx / dist) * force;
                    totalAccY += (dy / dist) * force;
                }

                ghostVX += totalAccX * dt;
                ghostVY += totalAccY * dt;

                double nextX = ghostX + ghostVX * dt;
                double nextY = ghostY + ghostVY * dt;

                g.drawLine((int)ghostX, (int)ghostY, (int)nextX, (int)nextY);

                ghostX = nextX;
                ghostY = nextY;

                if (Math.sqrt(Math.pow(ghostX - 400, 2) + Math.pow(ghostY - 400, 2)) < 30) {
                    break;
                }
            }
        }

    }

    private void addPlanet(ActionEvent e) {
        sim.addPlanet(getHeight(), getWidth());
    }

}

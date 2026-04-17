import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        Simulation physics = new Simulation();
        // physics.start();
        Renderer drawer = new Renderer(physics);

        JFrame frame = new JFrame();
        frame.add(drawer);
        frame.setSize(800, 800);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);


    }
}

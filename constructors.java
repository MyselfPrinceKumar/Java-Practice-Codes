class cylinder1 {
    private double Radius;
    private double Height;
    private double Area;
    private double Volume;

    public cylinder1(double R, double H) {
        this.Radius = R;
        this.Height = H;
        // System.out.println("the Radius of the Cylinder "+Radius);
        // System.out.println("the height of the Cylinder is: "+Height);

        // Area=2*Math.PI*Radius*(Radius+Height);
        // System.out.println("The Area of the cylinder is: "+Area);
        // Volume=Math.PI*Radius*Radius*Height;
        // System.out.println("the Voulume of the cylinder is: "+Volume);

    }

    public void getRadius() {
        System.out.println("the Radius of the Cylinder " + Radius);
    }

    public void getHeight() {
        System.out.println("the Height of the Cylinder " + Height);
    }

    public void getArea() {
        Area = 2 * Math.PI * Radius * (Radius + Height);
        System.out.println("The Area of the cylinder is: " + Area);
    }

    public void getVolume() {
        Volume = Math.PI * Radius * Radius * Height;
        System.out.println("the Voulume of the cylinder is: " + Volume);
    }
}

public class constructors {
    public static void main(String[] args) {
        cylinder1 c = new cylinder1(3.5, 6.5);
        c.getRadius();
        c.getHeight();
        c.getArea();
        c.getVolume();

    }

}

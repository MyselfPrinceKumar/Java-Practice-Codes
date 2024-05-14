abstract class pen {
    abstract void refil();

    abstract void write();

    public void ballPen()

    {

        System.out.println("this pen is useless");
        System.out.println("there are no refil in the pen");

    }

}

class FountainPen extends pen {
    void refil() {
        System.out.println("Refil...");
    }

    void write() {
        System.out.println("Write...");
    }

    public void changeNib()

    {

        System.out.println("change the nib of the pen");
    }
}

public class Abstract_classes {
    public static void main(String[] args) {
        FountainPen p = new FountainPen();
        p.changeNib();
        p.refil();
        p.write();
        p.ballPen();
    }
}

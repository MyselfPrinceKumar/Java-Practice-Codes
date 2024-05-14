class phone {
    public int Number = 34;
    // phone(){

    // }
    public void camera() {
        System.out.println("old phone has not better camera");

    }

    public void sound() {
        System.out.println("old generation phones has not better sound quality");
    }

    public int calculator() {
        System.out.println("old phone has not better calculator");
        return Number;
    }

    phone() {
        System.out.println("i m the constructor of the phone class");
    }

    phone(int num) {
        System.out.println("i m the overloaded constructor of the phone class");
    }

}

class SmartPhone extends phone {
    void Display() {
        System.out.println("smartphone has better display");
    }

    void vidioCall() {
        System.out.println("smartphone provides vidio call facilities");
    }
}

public class inheritence1 {
    public static void main(String[] args) {
        // phone p =new Phone();
        // we can access only phone class methods
        // p.Display();
        // p.vidioCall();
        // p.camera();
        // SmartPhone sp=new phone(); ---> throw error
        SmartPhone sp = new SmartPhone();
        sp.Display();
        sp.vidioCall();
        sp.camera();
        sp.calculator();
        sp.sound();
        // proble number 2 about constructor
        // phone p=new phone(23);
        // p.camera();
        // p.calculator();
        // p.sound();

    }
}

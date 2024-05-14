class monkey {
    public void jump() {
        System.out.println("monkey is jumping....");
    }

    public void bite() {
        System.out.println("monkey has more bite force than humans");
    }
}

interface BasicAnimal {
    // void eat(){
    // System.out.println("all animals are eating foods");
    // }
    // void sleep(){
    // System.out.println("al animals generally sleeps more then huamns");
    // }
    public void eat();

    public void sleep();
}

class human extends monkey implements BasicAnimal {
    public void eat() {
        System.out.println("all animals are eating foods");
    }
    public void sleep() {
        System.out.println("all animals generally sleeps more then humans");
    }
    public void greet() {
        System.out.println("chala ja bhosdike");
    }
}

public class Inheritance_interface {
    public static void main(String[] args) {
        human h = new human();
        h.bite();
        h.jump();
        h.eat();
        h.sleep();
        h.greet();

    }
}

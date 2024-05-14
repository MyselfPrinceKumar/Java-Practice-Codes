// class mohan {
//     String mohan() {
//         System.out.println("Constructor is called");
//         return "Mohan Madharchod";
//     }

//     mohan(int num) {
//         System.out.println("The Number is the  " + num);
//     }
// }

// public class constructores {
//     static int number() {
//         System.out.println("This is the number");
//         return 45;
//     }

//     public static void main(String[] args) {
//         mohan m = new mohan(34);
//         System.out.println(m.mohan());
//         System.out.println(number());
//     }
// }

//There are two types of constructors 
// default constructor and parameterized constructor
class mohan {
    int num;

    mohan() {
        System.out.println("Constructor is called");
    }

    mohan(int n) {
        this.num = n;
    }
}

public class constructores {
    public static void main(String[] args) {
        mohan m = new mohan(34);
        mohan mo = new mohan();
        double n = -67.3453;
        System.out.println((int)Math.abs(n));
        System.out.println(m.num);
        // System.out.println(number());
    }
}

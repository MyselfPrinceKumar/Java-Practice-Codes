import java.util.Scanner;

import javax.management.MBeanAttributeInfo;
import javax.swing.plaf.synth.SynthOptionPaneUI;

public class switch1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("enter your age");
        int age = sc.nextInt();
        switch (age) {
            case 21:
                System.out.println("your age is 21");
                break;
            case 30:
                System.out.println("your age is 30");
                break;

            default:
                System.out.println("your age is out5 of these");
                break;
        }
    }
}

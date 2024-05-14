import java.util.ArrayList;
import java.util.Set;
public class Advance_java_practiceSet {
    public static void main(String[] args) {
        ArrayList<String> S1 = new ArrayList<>();
        S1.add("Prince Kumar");
        S1.add("Ujjwal Babu");
        S1.add(1, "Prince Rock");
        S1.add("Abhi Kushwaha");
        S1.add("Arif Ansari");
        S1.add(0, "Nippu Kumar");
        S1.add("Ankit Kumar");
        S1.add("Tarun Kumar");
        S1.add("Bullet Kumar");
        S1.add("Vishal Kumar");
        S1.remove(3);
        // set method remove the index and place the String at given index
        S1.set(0, "The Rock");
        // Printing the Array Elements using foreach loop
        for (String i : S1) {
            System.out.println(i);
        }
        System.out.println(S1.indexOf("Prince Rock"));
        // Printing the Array Elements using for loop
        for (int i = 0; i < S1.size(); i++) {
            System.out.println(S1.get(i));
        }
        // Accessing the ArrayList elements
        System.out.println(S1.get(4));
    }
}

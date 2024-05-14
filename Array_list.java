import java.util.*;

public class Array_list {
    public static void main(String[] args) {
        ArrayList<Integer> A1 = new ArrayList<>();
        A1.add(36);
        A1.add(48);
        A1.add(60);
        A1.add(72);
        A1.add(84);
        // we can also pass the index of the added element
        A1.add(0, 12);
        A1.add(1, 24);
        // for removing the specified index we use bellow method
        A1.remove(6);

        // Replaces the element at the specified position in this list with the
        // specified element.
        A1.set(0, 200);
        A1.set(1, 400);
        A1.set(2, 600);

        // Below method is used to the clear the Array
        // A1.clear();

        // below method returns the index of the perticular element
        System.out.println("The index of element 60 is: " + A1.indexOf(60));

        // for Searching we use bellow method if it is fornd it returns true otherwise
        // False
        // A1.contains(24);
        System.out.println(A1.contains(24));

        // System.out.println(A1.get()); --> index passing are must be required
        // System.out.println(A1.get(0));
        // Here we use A1.size() to print the size of the Array not use A1.length()
        for (int i = 0; i < A1.size(); i++) {
            System.out.println(A1.get(i));
        }
    }
}

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class Sort_Matrics {
    public static void main(String[] args) {
        int[] arr = { 3, 4, 1, 7, 9, 12, 34, 2, 4, 6, 7, 8, 56, 34, 34, 3, 56 };
        ArrayList<Integer> odd = new ArrayList<>();
        ArrayList<Integer> even = new ArrayList<>();
        for (int i = 0; i < arr.length; i++) {
            if (i % 2 == 0) {
                even.add(arr[i]);
            } else {
                odd.add(arr[i]);
            }
        }
        System.out.println(odd);
        System.out.println(even);
        Collections.sort(odd);
        Collections.sort(even);
        System.out.println(odd);
        System.out.println(even);

        // finding second maximum in the both lists

        int secMaxOdd = Integer.MIN_VALUE;
        int maxOdd = odd.get(odd.size() - 1);
        for (int i = 0; i < odd.size(); i++) {
            if (odd.get(i) > secMaxOdd && odd.get(i) < maxOdd) {
                secMaxOdd = odd.get(i);
            }
        }
        int secMaxEven = Integer.MIN_VALUE;
        int maxEven = even.get(even.size() - 1);
        for (int i = 0; i < even.size(); i++) {
            if (even.get(i) > secMaxEven && even.get(i) < maxEven) {
                secMaxEven = even.get(i);
            }
        }
        System.out.println(secMaxOdd + secMaxEven);
    }
}

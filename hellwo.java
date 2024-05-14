import java.util.*;

public class hellwo {
    public static void main(String[] args) {
        String s = "123456";
        ArrayList<Integer> list = new ArrayList<>();
        char max = '0';
        for (int i = 0; i < s.length(); i++) {
            list.add((s.charAt(i).toInteger));
        }
        System.out.println(list);
    }
}


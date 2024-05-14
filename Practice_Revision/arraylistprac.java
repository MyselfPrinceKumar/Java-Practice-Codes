import java.util.*;

class arraylistprac {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(394);
        list.add(340);
        list.add(387);
        list.add(380);
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) > 100) {
                System.out.println(list.get(i));
                list.remove(list.get(i));
            }
        }
        // for (int i = 0; i < list.size(); i++) {
        // }
    }
}

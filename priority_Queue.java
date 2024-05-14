import java.util.PriorityQueue;

public class priority_Queue {
    public static void main(String[] args) {
        int[] arr = { 1, 2, 2, 2, 2, 2, 3, 4, 5, 6, 1, 4, 5 };
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int i = 0; i < arr.length; i++) {
            if (!pq.contains(arr[i])) {
                pq.add(arr[i]);
            }
        }
        System.out.println(pq);
    }
}

                       
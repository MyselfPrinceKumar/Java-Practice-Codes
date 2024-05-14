import java.util.ArrayList;

public class Stack_Using_ArrayList {

    static class Stack {
        static ArrayList<Integer> list = new ArrayList<>();

        public static boolean isEmpty() {
            if (list.size() == 0) {
                return true;
            }
            return false;
        }

        // push funtion
        public static void push(int data) {
            list.add(data);
        }

        // Pop function
        public static int pop() {
            if (isEmpty()) {
                return -1;
            }
            int top = list.get(list.size() - 1);
            list.remove(list.size() - 1);
            return top;
        }

        // Peek funtion
        public static int peek() {
            if (isEmpty()) {
                return -1;
            }
            return list.get(list.size() - 1);
        }
    }

    public static void main(String[] args) {
        Stack st = new Stack();
        st.push(12);
        st.push(24);
        st.push(36);
        st.push(48);
        while (!st.isEmpty()) {
            System.out.println(st.peek());
            st.pop();
        }
    }
}

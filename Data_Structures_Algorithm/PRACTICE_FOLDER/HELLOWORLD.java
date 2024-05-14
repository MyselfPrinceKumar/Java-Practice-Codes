import java.util.ArrayList;

// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HELLOWORLD {
    static class Stack {
        static ArrayList<Integer> list = new ArrayList<>();

        public static boolean isEmpty() {
            if (list.size() == 0) {
                return true;
            }
            return false;
        }

        // push function
        public static void push(int data) {
            list.add(data);
        }

        // pop function
        public static int pop() {
            if (isEmpty()) {
                return -1;
            }
            int top = list.get(list.size() - 1);
            list.remove(list.size() - 1);
            return top;
        }

        public static int peek() {
            if (isEmpty()) {
                return -1;
            }
            int top = list.get(list.size() - 1);
            return top;
        }

    }

    public static void main(String[] args) {
        Stack st = new Stack();
        st.push(23);
        st.push(12);
        st.push(8);
        // System.out.println(st.peek());
        while (!st.isEmpty()) {
            System.out.println(st.peek());
            st.pop();
        }
    }
}

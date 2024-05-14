public class Stack_Using_LinkedList {

    static class Node {
        int data;
        Node next;

        public Node(int data) {
            this.data = data;
            next = null;
        }
    }

    static class Stack {
        static Node head;

        public static boolean isEmpty() {
            if (head == null) {
                return true;
            }
            return false;
        }

        // Push an element into the stack.
        public static void push(int data) {
            Node newNode = new Node(data);
            if (isEmpty()) {
                head = newNode;
                return;
            }
            newNode.next = head;
            head = newNode;
        }

        // delete a element from the stack
        public static int pop() {
            if (isEmpty()) {
                return -1;
            }
            int top = head.data;
            head = head.next;
            return top;// we can't print head.data because
            // head is pointing to the next node. so After printing all elements it gives
            // NullPointerException.
        }

        // Peek the element from the stack.
        public static int peek() {
            if (isEmpty()) {
                return -1;
            }
            return head.data;
        }

    }

    public static void main(String[] args) {
        Stack st = new Stack();
        st.push(1);
        st.push(2);
        st.push(3);
        st.push(4);
        // st.pop();
        // System.out.println(st.peek());
        while (!st.isEmpty()) {
            System.out.println(st.peek());
            st.pop();
        }
    }
}

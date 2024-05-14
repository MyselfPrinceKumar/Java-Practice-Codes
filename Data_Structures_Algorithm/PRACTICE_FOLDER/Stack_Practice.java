public class Stack_Practice {

    static class Node {
        int data;
        Node next;

        Node(int data) {
            this.data = data;
            this.next = null;
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

        // Push function to insert a newNode in the stack.
        public static void push(int data) {
            Node newNode = new Node(data);
            if (isEmpty()) {
                head = newNode;
                return;
            }
            newNode.next = head;
            head = newNode;
        }

        // Pop function to delete a node from the stack.
        public static int pop() {
            if (isEmpty()) {

                return -1;
            }
            int top = head.data;
            head = head.next;  
            return top; // we can't print head.data because
            // head is pointing to the next node. so After printing all elements it gives
            // NullPointerException.
        }
        public static int peek() {
            if (isEmpty()) {
                return -1;
            }
            return head.data;
        }
    }

    public static void main(String[] args) {
        Stack sc = new Stack();
        sc.push(23);
        sc.push(20);
        sc.push(17);
        sc.push(12);
        sc.push(26);

        while (!sc.isEmpty()) {
            System.out.println(sc.peek());
            sc.pop();
        }
    }
}

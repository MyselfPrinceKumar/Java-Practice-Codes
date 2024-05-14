public class Circular_LL {
    Node head;
    Node tail;

    class Node {
        String data;
        Node next;

        Node(String data) {
            this.data = data;
            this.next = null;
        }
    }

    // Add newNode at the First
    public void addFirst(String data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
            return;
        }
        newNode.next = head;
        tail.next = newNode;
        head = newNode;
    }

    // Add the newNode at the last position of the
    public void addLast(String data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
            return;
        }
        tail.next = newNode;
        newNode.next = head;
        tail = newNode;

    }

    // // Inserting a newNode at a specific position
    public void InsertPosition(String data, int position) {
        Node newNode = new Node(data);
        int i = 0;
        if (head == null) {
            head = newNode;
            tail = newNode;
            return;
        }
        if (position == 0) {
            newNode.next = head;
            head = newNode;
            tail.next = head;
            return;
        }
        Node currNode = head;
        while (i < position - 1) {
            currNode = currNode.next;
            i++;
        }
        newNode.next = currNode.next;
        currNode.next = newNode;
    }

    // Print the Linked list.
    public void printLinkedList() {
        Node currNode = head;
        if (head == null) {
            System.out.println("The linked List is Empty");
            return;
        }
        // while (currNode.next != head) {
        // System.out.println(currNode.data);
        // currNode = currNode.next;
        // }
        // System.out.println(tail.data);
        // Second way to traverse the circular linked list
        do {
            System.out.println(currNode.data);
            currNode = currNode.next;
        } while (currNode != head);
    }

    public static void main(String[] args) {
        Circular_LL list = new Circular_LL();
        list.addFirst("prince");
        list.addLast("Moosewala");
        list.addFirst("is");
        list.addFirst("rock");
        list.addFirst("the");
        list.InsertPosition("hello", 3);
        list.printLinkedList();
    }
}

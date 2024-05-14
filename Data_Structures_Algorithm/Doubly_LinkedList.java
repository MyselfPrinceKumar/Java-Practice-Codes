public class Doubly_LinkedList {
    Node head;

    class Node {
        Node next;
        Node prev;
        int data;

        Node(int data) {
            this.data = data;
            this.next = null;
            this.prev = null;
        }
    }

    // Insert newNode at the first of the doubly linked list.
    public void insertFirst(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        newNode.next = head;
        head.prev = newNode;
        head = newNode;
    }

    // Insert newNode at the last of the Doubly Linked List.
    public void insertLast(int data) {
        Node newNode = new Node(data);
        Node currNode = head;
        if (currNode == null) {
            head = newNode;
            return;
        }
        while (currNode.next != null) {
            currNode = currNode.next;
        }
        currNode.next = newNode;
        newNode.prev = currNode;
        // head = newNode;
    }

    // Display the doubly linked list.
    public void displayLL() {
        Node currNode = head;
        if (currNode == null) {
            System.out.println("The Doubly Linked List is Empty !");
            return;
        }
        while (currNode != null) {
            System.out.print(currNode.data + "->");
            currNode = currNode.next;
        }
        System.out.println("null");
    }

    // Functions to display the Reversed linked list

    public void reverseDisplay() {
        System.out.println("Displaying Linked List in reverse Order");
        Node currNode = head;
        Node lastNode = null;
        if (currNode == null) {
            System.out.println("Linked List is Empty");
            return;
        }
        while (currNode != null) {
            lastNode = currNode;
            currNode = currNode.next;
        }
        while (lastNode != null) {
            System.out.print(lastNode.data + "->");
            lastNode = lastNode.prev;
        }
        System.out.println("null");

    }

    public static void main(String[] args) {
        Doubly_LinkedList list = new Doubly_LinkedList();
        list.insertFirst(12);
        list.insertFirst(24);
        list.insertFirst(36);
        list.insertFirst(48);
        list.insertLast(78);
        list.insertLast(80);
        list.insertLast(84);
        list.displayLL();
        list.reverseDisplay();
    }
}

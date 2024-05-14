public class LinkedList_Practice {
    Node head;

    class Node {
        Node next;
        String data;

        Node(String data) {
            this.data = data;
            this.next = null;
        }
    }

    // Add New Node at the first
    public void addFirst(String data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        newNode.next = head;
        head = newNode;
    }

    // Add newNode at the end
    public void addLast(String data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node currNode = head;
        while (currNode.next != null) {
            currNode = currNode.next;
        }
        currNode.next = newNode;
    }

    // Print the linkedList
    public void printLinkedList() {
        if (head == null) {
            System.out.println("The linked List is empty ");
            return;
        }
        Node currNode = head;
        while (currNode != null) {
            System.out.println(currNode.data);
            currNode = currNode.next;
        }
        System.out.println("null");
    }

    // delete the first node of the linked list.
    public void deleteFirst() {
        if (head == null) {
            return;
        }
        head = head.next;
    }

    // Delete the last node of the linked list.
    public void deleteLast() {
        if (head == null) {
            return;
        }
        if (head.next == null) {
            head = null;
            return;
        }

        Node currNode = head;
        while (currNode.next.next != null) {
            currNode = currNode.next;
        }
        currNode.next = null;
    }

    public void calSize() {
        Node currNode = head;
        int size = 0;
        while (currNode != null) {
            currNode = currNode.next;
            size++;
        }
        System.out.println("ths size of the list is " + size);
    }

    public static void main(String[] args) {
        // Creating the object of the main class
        LinkedList_Practice list = new LinkedList_Practice();
        list.addFirst("Prince");
        list.addFirst("MySelf");
        list.addLast("Kumar");
        list.addFirst("Hello Everyone");
        list.printLinkedList();
        list.calSize();
        list.deleteFirst();
        list.deleteLast();
        list.printLinkedList();
        list.calSize();
    }
}

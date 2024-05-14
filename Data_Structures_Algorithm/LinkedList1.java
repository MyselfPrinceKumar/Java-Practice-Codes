public class LinkedList1 {
    Node head;

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
            return;
        }
        newNode.next = head;
        head = newNode;
    }

    // Add the newNode at the last position
    public void addLast(String data) {
        Node newNode = new Node(data);
        Node currNode = head;
        if (head == null) {
            head = newNode;
            return;
        }
        while (currNode.next != null) {
            currNode = currNode.next;
        }
        currNode.next = newNode;
    }

    // Inserting a newNode at a specific position
    public void InsertPosition(String data, int position) {
        Node newNode = new Node(data);
        int i = 0;
        if (head == null) {
            head = newNode;
            return;
        }
        if (position == 0) {
            newNode.next = head;
            head = newNode;
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

    // Print the Linked list
    public void printLinkedList() {
        Node currNode = head;
        if (head == null) {
            System.out.println("The linked List is Empty");
            return;
        }
        while (currNode != null) {
            System.out.println(currNode.data);
            currNode = currNode.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        LinkedList1 list = new LinkedList1();
        list.addFirst("is");
        list.addLast("Rock");
        list.addFirst("prince");
        list.addLast("Star");
        list.InsertPosition("harry", 0);
        list.printLinkedList();
    }
}

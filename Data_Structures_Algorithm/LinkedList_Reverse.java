public class LinkedList_Reverse {
    // Reverse a linked List using iterative Approach.
    Node head;

    class Node {
        int data;
        Node next;

        Node(Integer data) {
            this.data = data;
            this.next = null;
        }
    }

    // Adding elements in the last of the linked list
    public void addLast(Integer data) {
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

    // Printing the linked list
    public void printList() {
        if (head == null) {
            System.out.println("List is empty");
            return;
        }
        Node currNode = head;
        while (currNode != null) {
            System.out.println(currNode.data);
            currNode = currNode.next;
        }

    }

    // Reverse the Linked List
    public void reverseList() {
        Node prevNode = null;
        Node currNode = head;
        Node nextNode;
        if (head == null || head.next == null) {
            return;
        }
        while (currNode != null) {

            nextNode = currNode.next; // pehle next node ko store krenge otherwise ye lost ho jayega
            currNode.next = prevNode;

            // Update the prev node and current node
            prevNode = currNode; // pehle prevNode ko one step aage badhayenge uske baad current node ko
            // Agar current Node ko next kr denge to prev node =current krenge to prev do
            // step aage chala jayega
            // jo ki galat baat h prev and current dono ko one-one step move krana h.
            currNode = nextNode;
            System.out.println(prevNode.data);
        }
        head.next = null;
        head = prevNode;
    }

    public static void main(String[] args) {
        LinkedList_Reverse list = new LinkedList_Reverse();
        list.addLast(12);
        list.addLast(24);
        list.addLast(36);
        list.addLast(48);
        list.addLast(60);
        list.addLast(72);
        list.addLast(84);
        list.addLast(96);
        list.printList();
        System.out.println("Reversed Linked list are :");
        list.reverseList();
        // list.printList();
    }
}

import java.util.Stack;

public class Stack_Using_CollectionFramework {
    public static void main(String[] args) {
        // java.util.Stack<Integer> st = new java.util.Stack<>(); //ye likhte h tostack
        // ko import nii krna padega.
        Stack<Integer> st = new Stack<>();
        st.push(34);
        st.push(23);
        st.push(23);
        System.out.println(st.capacity());
        System.out.println(st.contains(3)); // searches the elements 3 and return true/false
        System.out.println(st.empty()); // return true if the stack is empty
        while (!st.empty()) {
            System.out.println(st.peek());
            st.pop();
        }
    }
}

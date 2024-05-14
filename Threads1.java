class MyThread1 extends Thread {
    public void run() {
        int i = 0;
        while (i < 3000) {
            System.out.println("Good morning");
            i++;
        }
    }
}

class MyThread2 extends Thread {
    public void run() {
        int i = 0;
        while (i < 3000) {
            System.out.println("chala ja bhosdike");
            i++;
        }
    }
}

public class Threads1 {
    public static void main(String[] args) {
        // problem 1
        MyThread1 m1 = new MyThread1();
        MyThread2 m2 = new MyThread2();
        // m1.setPriority(Thread.MAX_PRIORITY);
        // m2.setPriority(Thread.MIN_PRIORITY);
        // problem 2
        // try {
        // m1.sleep(200);
        // } catch (Exception e) {
        // // TODO: handle exception
        // System.out.println(e);
        // }
        m1.start();
        m2.start();
        // System.out.println(m1.getId());
        // System.out.println(m2.getId());
    }
}
// if you are implemention runnable class this is compulsary to define run
// methods
// class MyThread1 implements Runnable {
// public void run() {
// int i = 0;
// while (i < 3000) {
// System.out.println("Good morning");
// i++;
// }
// }

// }
// class MyThread2 implements Runnable {
// public void run() {
// int i = 0;
// while (i < 3000) {
// System.out.println("chala ja bhosdike");
// i++;
// }
// }
// }

// public class Threads1 {
// public static void main(String[] args) {
// MyThread1 m1 = new MyThread1();
// Thread t1 = new Thread(m1);
// MyThread2 m2 = new MyThread2();
// Thread t2 = new Thread(m2);
// // t1.setPriority(Thread.MAX_PRIORITY);
// // t2.setPriority(Thread.MIN_PRIORITY);
// // t1.start();
// // t2.start();
// // problem 4
// System.out.println(t1.getState());
// System.out.println(t2.getState());
// // System.out.println(m1.getId());
// // System.out.println(m2.getId());
// }
// }
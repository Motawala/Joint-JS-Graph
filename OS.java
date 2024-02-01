import java.time.Clock;
import java.util.List;

public class OS {

    private static Kernel kernel;
    private static Clock clock = Clock.systemDefaultZone();
    private static int currentPid = -1;
    public static Scheduler scheduler;


    public enum Priority{
        HIGH,
        MEDIUM,
        LOW
    }
    public static void Startup(UserlandProcess init){

        // Call Kernel's CreateProcess with the initial process.
        scheduler = new Scheduler();
        kernel = new Kernel();
        kernel.CreateProcess(init);
    }

    public static int CreateProcess(UserlandProcess up) {
        // Call Kernel's CreateProcess and return the PID with default priority (MEDIUM).
        return CreateProcess(up, Priority.MEDIUM);
    }
    public static int CreateProcess(UserlandProcess up, Priority priority) {
        if (kernel == null) {
            throw new IllegalStateException("Kernel has not been created. Call Startup first.");
        }

        // Call Kernel's CreateProcess and return the PID.
        int pid = kernel.CreateProcess(up);
        currentPid = pid; // Update the current PID
        return pid;
    }
    public static void Sleep(int milliseconds) {
        if (kernel == null) {
            throw new IllegalStateException("Kernel has not been created. Call Startup first.");
        }
        kernel.Sleep(milliseconds);
    }
    public static int GetPid() {
        if (kernel != null) {
            return kernel.GetPid();
        }
        return -1;
    }

    public static int GetPidByName(String processName) {
        if (kernel != null) {
            return kernel.GetPidByName(processName);
        }
        return -1;
    }
    public void SendMessage(KernelMessage km){
        kernel.SendMessage(km);
    }
    public KernelMessage WaitForMessage() {
        return kernel.WaitForMessage();
    }


}

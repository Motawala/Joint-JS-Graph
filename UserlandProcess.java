public abstract class UserlandProcess implements Runnable{
    private int pid;
    private static final int PAGE_SIZE = 1024;
    public static int[][] tlb = new int[2][2];
    private byte[] memory = new byte[1024 * 1024];

    public int getPid() {
        return pid;
    }
    byte Read(int address) throws Exception {
        int virtualPage = address/ PAGE_SIZE;
        int pageOffset = address % PAGE_SIZE;

        int physicalPage = getPhysicalPageFromTLB(virtualPage);

        if(physicalPage == -1){
            KernelandProcess.getMapping(virtualPage);
            physicalPage = getPhysicalPageFromTLB(virtualPage);
            if (physicalPage == -1) {
                throw new Exception("TLB not found Error");
            }
        }

        int physicalAddress = physicalPage * PAGE_SIZE +pageOffset;

        return memory[physicalAddress];

    }
    void Write(int address, byte value){
        int virtualPage = address/ PAGE_SIZE;
        int pageOffset = address % PAGE_SIZE;

        int physicalPage = getPhysicalPageFromTLB(virtualPage);

        if(physicalPage == -1){
            physicalPage = virtualPage;
            updateTLB(virtualPage, physicalPage);
        }

        int physicalAddress = physicalPage * PAGE_SIZE +pageOffset;
        memory[physicalAddress] = value;


    }

    private int getPhysicalPageFromTLB(int virtualPage) {

        for (int i = 0; i < tlb.length; i++) {
            if (tlb[i][0] == virtualPage) {
                return tlb[i][1];
            }
        }
        return -1;
    }
    private void updateTLB(int virtualPage, int physicalPage){
        tlb[0][0] = virtualPage;
        tlb[0][1] = virtualPage;
    }
    public static void clearTLB() {
        // Simulate clearing the TLB
        for (int i = 0; i < tlb.length; i++) {
            tlb[i][0] = -1;
            tlb[i][1] = -1;
        }
    }

}

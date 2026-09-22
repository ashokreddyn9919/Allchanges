public class DataFactory {
    
    private AccountFactory af;
    private CaseFactory cf;
    private OpportunityFactory opf;
    private SolarBotFactory sbf;
    private SolarBotStatusFactory sbsf;

    class DataFactoryException extends Exception {}
    
    public DataFactory() {
        af = new AccountFactory();
        cf = new CaseFactory();
        opf = new OpportunityFactory();
        sbf = new SolarBotFactory();
        sbsf = new SolarBotStatusFactory();
    }

    public Id generateData() {
        // Check for concurrent BatchRecordCreator jobs
        Id runningJobId = BatchRecordCreator.getRunningJobId();
        if (runningJobId != null) {
            throw new DataFactoryException('Can only run one BatchRecordCreator job at time. Found existing job: '+ runningJobId);
        }
        
        // Clean previously generated data if any
        af.deleteGeneratedAccountsAndRelatedRecords();

        // Generate accounts
        List<Account> accounts = af.generate();
        insert accounts;

        List<Case> cases = new List<Case>();
        List<Opportunity> opportunities = new List<Opportunity>();
        List<SolarBot_Status__c> statuses = new List<SolarBot_Status__c>();

        for (Account account : accounts) {
            // Generate cases
            cases.addAll(cf.generate(account));

            // Generate opportunities
            opportunities.addAll(opf.generate(account));

            // Generate bots
            List<SolarBot__c> accountBots = sbf.generate(account);
            insert accountBots;

            // Generate bots statuses
            for (SolarBot__c bot : accountBots) {
                statuses.addAll(sbsf.generate(bot));
            }
        }
        insert cases;
        insert opportunities;

        // Skip batch operations when running tests
        if (Test.isRunningTest()) {
            return null;
        }
        // Insert statuses in batch of 5000 and return job Id
        BatchRecordCreator batchCreator = new BatchRecordCreator(statuses);
        return Database.executeBatch(batchCreator, 5000);
    }

    public boolean hasSampleData() {
        Integer botCount = Database.countQuery('SELECT COUNT() FROM SolarBot__c');
        return (botCount != 0);
    }
}
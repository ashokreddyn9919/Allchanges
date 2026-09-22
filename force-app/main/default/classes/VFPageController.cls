public class VFPageController {
    
    public static void getAccountRecords(String UserParam){
        
        //UserParam=string.escapeSingleQuotes(UserParam); //sanitized the parameter
        
        //Database.QueryWithbinds(query,map,AccessLevel.USER_MODE);
        
        Map<String,Object> queryMap=new Map<String, Object>();
        queryMap.put('AccountName',UserParam);
        
        
        String query= 'SELECT Id,Name,AnnualRevenue FROM account';
        String whereClause = ' Where Name=:AccountName';
        query+=whereClause;
        system.debug(query);
        
        list<Account> listAccount=Database.QueryWithbinds(query,queryMap,AccessLevel.USER_MODE);
        
        for(Account acc:listAccount){
            system.debug('*************************');
            system.debug(acc.Name);
            system.debug(acc.AnnualRevenue);
            system.debug('*************************');
        }
    }

}
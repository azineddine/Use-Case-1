public with sharing class MoviesController {

    @AuraEnabled(cacheable = true)
    public static List<Movie__c> getAllMovies () {
        return [SELECT name, category__c, release_date__c 
            FROM movie__c  
            WITH SECURITY_ENFORCED
            LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static List<Movie__c> searchMovies (String searchTerm) {
        if(searchTerm == '' || searchTerm == null) {
            return getAllMovies();
        } 
        searchTerm = '%' + searchTerm + '%';
        return [SELECT name, category__c, release_date__c 
        FROM movie__c 
        WHERE name LIKE :searchTerm
        WITH SECURITY_ENFORCED
        LIMIT 10];
    }

}
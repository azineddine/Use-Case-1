@isTest
public class MoviesControllerTest {
    
    @TestSetup static void makeDatae () {
           TestDataFactory.createSObjectList('Movie__c',new Map<String,Object>{'name' => 'Test{!index}'} ,3);
    }  
    @isTest static void searchMoviesTestWithFilter() {
       List<Movie__c> res = MoviesController.searchMovies('Test1');
         System.assertEquals(res.size(), 1, 'Unexpected search result.');
    }
    
    @isTest static void searchMoviesTestFullList() {
       List<Movie__c> res = MoviesController.searchMovies('');
         System.assertEquals(res.size(), 3, 'Unexpected search result.');
    }
}
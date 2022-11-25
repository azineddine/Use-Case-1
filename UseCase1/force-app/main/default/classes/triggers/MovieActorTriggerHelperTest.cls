@isTest
public with sharing class MovieActorTriggerHelperTest {
private static final String MALE = 'Male';
private static final String FEMALE = 'Female';

  @TestSetup
  static void dataSetup() {
    TestDataFactory.createSObjectList('Movie__c', 5);
    TestDataFactory.createSObjectList(
      'Actor__c',
      new Map<String, Object>{ 'Gender__c' => MALE },
      15
    );

    TestDataFactory.createSObjectList(
      'Actor__c',
      new Map<String, Object>{ 'Gender__c' => FEMALE },
      15
    );
  }

  @isTest
  static void updateNumberOfMoviesTest() {
    List<Movie__c> movies = [SELECT Id FROM Movie__c];
    List<Actor__c> actors = [SELECT Id FROM Actor__c LIMIT 5];

    List<MovieActor__c> moviesActors = new List<MovieActor__c>{
      new MovieActor__c(
        Name = 'test1',
        Movie__c = movies.get(0).Id,
        Actor__c = actors.get(0).Id
      ),
      new MovieActor__c(
        Name = 'test2',
        Movie__c = movies.get(1).Id,
        Actor__c = actors.get(1).Id
      ),
      new MovieActor__c(
        Name = 'test3',
        Movie__c = movies.get(2).Id,
        Actor__c = actors.get(0).Id
      ),
      new MovieActor__c(
        Name = 'test4',
        Movie__c = movies.get(3).Id,
        Actor__c = actors.get(0).Id
      )
    };

    List<ID> ids = new List<ID>();
    ids.add(actors.get(0).Id);
    ids.add(actors.get(1).Id);

    Test.startTest();
    Database.SaveResult[] results = Database.insert(moviesActors, false);
    Test.stopTest();

    Map<ID, Actor__c> actorss = new Map<ID, Actor__c>(
      [SELECT Id, Number_of_movies__c FROM Actor__c WHERE id IN :ids]
    );

    System.assertEquals(
      3,
      actorss.get(ids.get(0)).Number_of_movies__c,
      'Unexpected'
    );
    System.assertEquals(
      1,
      actorss.get(ids.get(1)).Number_of_movies__c,
      'Unexpected'
    );
  }

  
  @isTest
  static void updateNumberOfMoviesDeleteTest() {
    List<Movie__c> movies = [SELECT Id FROM Movie__c];
    List<Actor__c> actors = [SELECT Id FROM Actor__c LIMIT 5];

    List<MovieActor__c> moviesActors = new List<MovieActor__c>{
      new MovieActor__c(
        Name = 'test1',
        Movie__c = movies.get(0).Id,
        Actor__c = actors.get(0).Id
      ),
      new MovieActor__c(
        Name = 'test2',
        Movie__c = movies.get(1).Id,
        Actor__c = actors.get(0).Id
      )
    };

    insert moviesActors;

    MovieActor__c movieActorToDelete = moviesActors.get(0);
	
    Test.startTest();
    Database.DeleteResult results = Database.delete(movieActorToDelete, false);
    Test.stopTest();

    Map<ID, Actor__c> actorss = new Map<ID, Actor__c>(
      [SELECT Id, Number_of_movies__c FROM Actor__c WHERE id = :movieActorToDelete.Actor__c]
    );
      
	
    System.assertEquals(
      1,
      actorss.get(movieActorToDelete.Actor__c).Number_of_movies__c,
      'Unexpected'
    );
    
  }
}

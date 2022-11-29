public with sharing class MoviesController {
  @AuraEnabled(cacheable=true)
  public static List<Movie__c> getAllMovies() {
    return [
      SELECT name, category__c, release_date__c, Picture__c, Rating__c
      FROM movie__c
      WITH SECURITY_ENFORCED
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<Movie__c> searchMovies(String searchTerm) {
    if (searchTerm == '' || searchTerm == null) {
      return getAllMovies();
    }
    searchTerm = '%' + searchTerm + '%';
    return [
      SELECT name, category__c, release_date__c, Picture__c, Rating__c
      FROM movie__c
      WHERE name LIKE :searchTerm
      WITH SECURITY_ENFORCED
    ];
  }

  @AuraEnabled
  public static Movie__c createMovie(Movie__c movie, List<ID> actorIds) {

    Boolean isUpdate = movie.Id != null ;

    if (Schema.sObjectType.Movie__c.isCreateable()) {
      upsert movie;

      List<MovieActor__c> movieActors = new List<MovieActor__c>();
      List<Id> idsToAdd = new List<Id>();
      // in case of Update
      List<Id> existingIds = new List<Id>();
      List<Id> idsToDelete = new List<Id>();
      

      if(isUpdate) {
        for(MovieActor__c movAct : [SELECT id FROM MovieActor__c WHERE Movie__C = :movie.Id]) {
          existingIds.add(movAct.id);
        }
        // Iterate through actorIds
       // check if this id exsists in the database
       // if not add it
        for(Id actorId : actorIds) {
          if(!existingIds.contains(actorId)) {
            idsToAdd.add(actorId);
          }
        }
       // iterate through ids from database
       // check if this id is included in actorIds 
       // if not delete it

       for(Id actorId : existingIds) {
        if(!actorIds.contains(actorId)) {
            idsToDelete.add(actorId);
        }
       }
       List<MovieActor__c> movieActorsToDelete = [SELECT id FROM MovieActor__c WHERE id IN :idsToDelete];

       delete movieActorsToDelete;

      }

      else {
        idsToAdd = actorIds;
      }

      for (ID actorId : idsToAdd) {
        movieActors.add(
          new MovieActor__c(
            Name = movie.Name + '' + actorId,
            Movie__c = movie.Id,
            Actor__c = actorId
          )
        );
      }
      if (Schema.sObjectType.MovieActor__c.isCreateable()) {
        insert movieActors;
      }
      return movie;

    }

    return null;

  
  }

  public static List<Schema.PicklistEntry> getMovieCategoryList() {
    Schema.DescribeFieldResult fieldDescription = Movie__C.Category__c.getDescribe();
    List<Schema.PicklistEntry> entries = fieldDescription.getPicklistValues();

    return entries;
  }
}

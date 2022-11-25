public with sharing class MoviesController {
  @AuraEnabled(cacheable=true)
  public static List<Movie__c> getAllMovies() {
    return [
      SELECT name, category__c, release_date__c
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
      SELECT name, category__c, release_date__c
      FROM movie__c
      WHERE name LIKE :searchTerm
      WITH SECURITY_ENFORCED
    ];
  }

  @AuraEnabled
  public static Movie__c createMovie(Movie__c movie, List<ID> actorIds) {
    if (Schema.sObjectType.Movie__c.isCreateable()) {
      insert movie;
    }

    List<MovieActor__c> movieActors = new List<MovieActor__c>();
    for (ID actorId : actorIds) {
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

  public static List<Schema.PicklistEntry> getMovieCategoryList() {
    Schema.DescribeFieldResult fieldDescription = Movie__C.Category__c.getDescribe();
    List<Schema.PicklistEntry> entries = fieldDescription.getPicklistValues();

    return entries;
  }
}

public with sharing class MovieActorTriggerHelper {
  public static void updateNumberOfMovies(
    List<MovieActor__c> movieActors,
    Boolean isDelete
  ) {
    Set<Id> actorIds = new Set<Id>();

    for (MovieActor__c movieActor : movieActors) {
      actorIds.add(movieActor.Actor__c);
    }

    Map<Id, AggregateResult> mapMovieActor = new Map<Id, AggregateResult>(
      [
        SELECT Actor__r.Id, Count(Name)
        FROM MovieActor__c
        WHERE id IN :movieActors
        WITH SECURITY_ENFORCED
        GROUP BY Actor__r.Id
      ]
    );

    List<Actor__c> actors = [
      SELECT ID, Number_of_movies__c
      FROM Actor__c
      WHERE ID IN :actorIds
      WITH SECURITY_ENFORCED
    ];

    for (Actor__c actor : actors) {
      Integer count = Integer.valueOf(mapMovieActor.get(actor.Id).get('expr0'));
      if (isDelete) {
        actor.Number_of_movies__c -= count;
      } else {
        actor.Number_of_movies__c += count;
      }
    }

    if (
      Schema.SObjectType.Actor__c.isUpdateable() &&
      Schema.SObjectType.Actor__c.fields.Number_of_movies__c.isUpdateable()
    ) {
      update actors;
    }
  }

  public static void updateGenderPercentage(List<MovieActor__c> movieActors) {
    Set<Id> movieIds = new Set<Id>();

    for (MovieActor__c movieActor : movieActors) {
      movieIds.add(movieActor.Movie__c);
    }

    Map<Id, AggregateResult> movieActorMapMale = movieActorMapByGender(
      movieIds,
      'Male'
    );
    Map<Id, AggregateResult> movieActorMapFemale = movieActorMapByGender(
      movieIds,
      'Female'
    );

    List<Movie__c> movieList = [
      SELECT ID, FemaleActorsPercentage__c, MaleActorsPercentage__c
      FROM Movie__c
      WHERE ID IN :movieIds
      WITH SECURITY_ENFORCED
    ];

    for (Movie__c movie : movieList) {
      Integer numberMales = movieActorMapMale.get(movie.id) != null
        ? Integer.valueOf(movieActorMapMale.get(movie.id).get('expr0'))
        : 0;

      Integer numberFemales = movieActorMapFemale.get(movie.id) != null
        ? Integer.valueOf(movieActorMapFemale.get(movie.id).get('expr0'))
        : 0;

      Integer total = numberFemales + numberMales;

      movie.FemaleActorsPercentage__c = (Decimal) numberFemales / total * 100;
      movie.MaleActorsPercentage__c = (Decimal) numberMales / total * 100;
    }

    if (
      Schema.SObjectType.Movie__c.isUpdateable() &&
      Schema.SObjectType.Movie__c.fields.MaleActorsPercentage__c.isUpdateable() &&
      Schema.SObjectType.Movie__c.fields.FemaleActorsPercentage__c.isUpdateable()
    ) {
      update movieList;
    }
  }

  private static Map<Id, AggregateResult> movieActorMapByGender(
    Set<ID> movieIds,
    String gender
  ) {
    return new Map<Id, AggregateResult>(
      [
        SELECT Movie__r.Id, Count(Name)
        FROM MovieActor__c
        WITH SECURITY_ENFORCED
        GROUP BY Movie__r.Id, Actor__r.gender__c
        HAVING Actor__r.gender__c = :gender AND Movie__r.Id IN :movieIds
      ]
    );
  }
}

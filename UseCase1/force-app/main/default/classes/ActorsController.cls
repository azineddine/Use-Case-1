public with sharing class ActorsController {
  @AuraEnabled(cacheable=true scope='global')
  public static List<LookupSearchResult> search(
    String searchTerm,
    List<String> selectedIds
  ) {
    if (searchTerm == '' || searchTerm == null) {
      return getAllActors();
    }

    searchTerm = '%' + searchTerm + '%';
    List<Actor__C> actors = [
      SELECT name
      FROM Actor__c
      WHERE name LIKE :searchTerm
      WITH SECURITY_ENFORCED
    ];

    return mapActorToLookUpSearch(actors);
  }

  private static List<LookupSearchResult> mapActorToLookUpSearch(
    List<Actor__c> actors
  ) {
    List<LookupSearchResult> result = new List<LookupSearchResult>();

    for (Actor__c actor : actors) {
      result.add(
        new LookupSearchResult(
          actor.id,
          'Actor__c',
          null,
          actor.name,
          actor.id
        )
      );
    }

    return result;
  }

  @AuraEnabled(cacheable=true)
  public static List<LookupSearchResult> getAllActors() {
    List<Actor__C> actors = [
      SELECT name
      FROM Actor__c
      WITH SECURITY_ENFORCED
    ];

    return mapActorToLookUpSearch(actors);
  }

}

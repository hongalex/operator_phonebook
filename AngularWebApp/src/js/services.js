phoneControllers.factory('searchService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
    var client = elasticsearch({
        host: $location.host() + ':9200'
    });
    var search = function(term, num_results) {
        if (!term) {
            return $q(function(resolve, reject) {
                var empty = [];
                resolve(empty)
            })
        }
        var deferred = $q.defer();
        var query = {
            match_phrase_prefix: {
                _all: {
                    query: term,
                    max_expansions: 25
                }
            }
        };
        client.search({
            index: 'op',
            type: 'phone',
            body: {
                size: 100,
                query: query,
            },
        }).then(function(result) {
            var hits_in, hits_out = [];
            hits_in = (result.hits || {}).hits || [];
            for (var i = 0; i < hits_in.length; i++) {
                hits_out.push(hits_in[i]._source)
            }
            deferred.resolve(hits_out)
        }, deferred.reject);
        return deferred.promise
    };
    return {
        "search": search
    }
}]);
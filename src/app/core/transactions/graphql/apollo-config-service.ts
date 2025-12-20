import { Injectable } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApolloConfigService {

    constructor(
        private apollo: Apollo,
        private httpLink: HttpLink
    ) {}

    initializeApollo(): void {
        const uri = environment.graphqlEndpoint || 'http://localhost:8080/graphql';

        this.apollo.create({
            link: this.httpLink.create({ uri }),
            cache: new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            analyzedStatement: {
                                merge: false
                            },
                            summary: {
                                merge: false
                            }
                        }
                    }
                }
            }),
            defaultOptions: {
                watchQuery: {
                    errorPolicy: 'all'
                },
                query: {
                    errorPolicy: 'all'
                }
            }
        });
    }
}

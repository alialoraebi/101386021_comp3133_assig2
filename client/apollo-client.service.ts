// apollo-client.service.ts
import { Injectable } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

@Injectable({
  providedIn: 'root'
})
export class ApolloClientService {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    this.initializeApolloClient();
  }

  private initializeApolloClient(): void {
    const uri = 'http://localhost:4000/graphql'; // <-- Replace with your GraphQL server URI
    const http = this.httpLink.create({ uri });

    const apolloOptions = {
      link: http,
      cache: new InMemoryCache(),
    };

    this.apollo.create(apolloOptions);
  }
}

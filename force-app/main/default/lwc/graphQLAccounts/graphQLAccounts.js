import { LightningElement,wire } from 'lwc';
import {gql,graphql} from 'lightning/uiGraphQLApi';
export default class GraphQLAccounts extends LightningElement {
results;
errors;

@wire(graphql, {
    query:gql`
    query AccountWithName {
        uiapi {
            query {
                Account(first: 3){
                    edges {
                        node {
                            Id 
                            Name {
                                value
                            }
                            Phone {
                                value
                            }
                            AnnualRevenue {
                                value
                            }
                            Address__c {
                                value
                            }
                            Rating {
                                value
                            }
                        }
                    }
                }
            }
        }
    }`,
})
graphQLQueryResults({data, errors}){
    if(data){
        this.results = data.uiapi.query.Account.edges.map((edge) => edge.node);
    }
    this.errors = errors;
}

}
var express = require('express');
var graphqlHTTP = require('express-graphql');
var {GraphQLSchema, GraphQLObjectType, GraphQLString} = require('graphql');
var fetch = require('node-fetch');

function fetchJSON(url){
  return fetch(url)
    .then(res => res.json());
}

const pokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    pokemon: {
      type: pokemonType,
      args: {
        id: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        }
      },
      resolve: (_, {id, name}) => {
        const urlParam = id ? id : name;
        return fetchJSON('http://pokeapi.co/api/v2/pokemon/' + urlParam);
      }
    }
  }
});

const schema = new GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000, () => console.log('Server running'));
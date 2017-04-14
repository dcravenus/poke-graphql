var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql');
var fetch = require('node-fetch');

function getType(data){
  return {
    name: data.type.name
  };
}

const typeType = new GraphQLObjectType({
  name: 'Type',
  fields: () => {
    return {
      name: {
        type: GraphQLString
      }
    };
  }
});

const pokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    weight: {
      type: GraphQLString
    },
    height: {
      type: GraphQLString
    },
    types: {
      type: new GraphQLList(typeType),
      resolve: (pokemon) => pokemon.types.map(getType)
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
      resolve: function(_, {id, name}) {
        return new Promise(function(resolve, reject){
          const urlParam = id ? id : name;
          fetch('http://pokeapi.co/api/v2/pokemon/' + urlParam).then(function(data){
            data.json().then(function(data){
              resolve(data);
            });
          });
        });
      }
    }
  }
});

const schema = new GraphQLSchema({query: queryType});



var app =express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
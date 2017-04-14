var express = require('express');
var graphqlHTTP = require('express-graphql');
var {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql');
var fetch = require('node-fetch');

function fetchJSON(url){
  return fetch(url)
    .then(res => res.json());
}

const typeType = new GraphQLObjectType({
  name: 'Type',
  fields: () => {
    return {
      name: {
        type: GraphQLString
      },
      id: {
        type: GraphQLString
      },
      no_damage_to: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.no_damage_to.map((type)=>{
          return fetchJSON(type.url);
        })
      },
      no_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.no_damage_from.map((type)=>{
          return fetchJSON(type.url);
        })
      },
      half_damage_to: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.half_damage_to.map((type)=>{
          return fetchJSON(type.url);
        })
      },
      half_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.half_damage_from.map((type)=>{
          return fetchJSON(type.url);
        })
      },
      double_damage_to: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.double_damage_to.map((type)=>{
          return fetchJSON(type.url);
        })
      },
      double_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.double_damage_from.map((type)=>{
          return fetchJSON(type.url);
        })
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
      resolve: (pokemon) => pokemon.types.map((typeData)=>{
        return fetchJSON(typeData.type.url);
      })
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
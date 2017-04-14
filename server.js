var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList} = require('graphql');
var fetch = require('node-fetch');

function getType(data){
  return new Promise(function(resolve){
    fetch(data.type.url).then(function(data){
      data.json().then(function(data){
        resolve(data);
      });
    });
  });
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
          return getType({type: type});
        })
      },
      no_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.no_damage_from.map((type)=>{
          return getType({type: type});
        })
      },
      half_damage_to: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.half_damage_to.map((type)=>{
          return getType({type: type});
        })
      },
      half_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.half_damage_from.map((type)=>{
          return getType({type: type});
        })
      },
      double_damage_to: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.double_damage_to.map((type)=>{
          return getType({type: type});
        })
      },
      double_damage_from: {
        type: new GraphQLList(typeType),
        resolve: (type) => type.damage_relations.double_damage_from.map((type)=>{
          return getType({type: type});
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
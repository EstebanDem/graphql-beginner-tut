import {gql} from 'apollo-server';
import { ApolloServer } from 'apollo-server';


const persons = [
    {
        age: 21,
        name: 'Tebb',
        phone: '03-03-456',
        street: "Calle db",
        city: 'Madrid',
        id: "123213-asd123-sa"
    },
    {
        age: 10,
        name : "Esteban" ,
        phone : "044-123456",
        street: "Avenida Siempreviva",
        city: "Utah",
        id: "2312312312asd-213asd-213"
    },
    {
        age: 7,
        name: "Itzi",
        street: "Pasaje Testing",
        city: 'Ibiza',
        id: '21321321-21321321-213131'
    }
]

// La exclamación ! es cuando es un campo requerido

const typeDefs = gql`
    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        age: Int
        canDrink: Boolean
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }
`
/* Query es la query que vamos a hacer al servidor y queremos que nos devuelva, por ejemplo,
la cantidad de personas, por eso la exclamación
*/

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Person: {
        canDrink: (root) => root.age > 18
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.listen().then( ({url}) => {
    console.log(`Server ready at ${url}`)
} )
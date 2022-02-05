import {gql} from 'apollo-server';
import { ApolloServer, UserInputError } from 'apollo-server';
import {v1 as uuid} from 'uuid';
import axios from 'axios';

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

    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        age: Int
        canDrink: Boolean
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person

        editNumber(
            name: String!
            phone: String!
        ): Person
    }
`
/* Query es la query que vamos a hacer al servidor y queremos que nos devuelva, por ejemplo,
la cantidad de personas, por eso la exclamación
*/

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: async (root, args) => {
            const {data:personsFromRestApi} = await axios.get('http://localhost:3000/persons')
            if (!args.phone) return personsFromRestApi

            const byPhone = person => 
                args.phone === 'YES' ? person.phone : !person.phone
            
            return personsFromRestApi.filter(byPhone)
        },
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root,args) => {
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            const person = {...args, id: uuid()}
            persons.push(person) // update database with new person
            return person
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name)
            if(personIndex === -1) return null
            
            const person = persons[personIndex]

            const updatedPerson = {...person, phone:args.phone}
            persons[personIndex] = updatedPerson;
            return updatedPerson;
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.listen().then( ({url}) => {
    console.log(`Server ready at ${url}`)
} )


# Building Importer
This is a really simple node app that takes a file as input, it is then processed / transformed in some way
and finally saved in the DB. It simulates a simple common business requirement.

## The shape of the building records in the json file
```
{
  "id": 123,                          // number [required]
  "name": "The shard",                // string [optional]
  "aliases": ["The shard of glass"],  // array<string> [optional]
  "address": {                        // object [optional]
    "line1": "32",                    // string [optional]
    "line2": "London bridge street",  // string [optional]
    "city": "London",                 // string [optional]
    "postcode": "SE1 9SG"             // string [optional]
  }
}
```

## Implemented requirements
The code base has the following requirements fully implemented:
 * Take a file containing 'buildings' and save them to a mongo collection called buildings
 * The _id in the mongo document should take the id of the building
 * Each imported document should have an imported date
 * Create a field called 'fullAddress' that is the concatenation of name, line 1, line 2, city and postcode
 
## New requirements
The following requirements have been recently added and are not tested
 * Some of our customers dont want their buildings in the DB, if the postcode starts with M4 then we will exclude these buildings


### Environment variables
```bash
export FILENAME=test/data/testData.json
export MONGO_CONNECTION_STRING=mongodb://localhost:27017/buildingImporter
```

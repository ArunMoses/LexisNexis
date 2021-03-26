const lodash = require("lodash");


function transform(data) {
  return data.map(doc => {
    const mongoDoc = lodash.cloneDeep(doc);
    mongoDoc._id = mongoDoc.id;
    mongoDoc.importedDate = Date.now();
    mongoDoc.fullAddress = `${doc.name}, ${doc.address.line1}, ${doc.address.line2}, ${doc.address.city}, ${doc.address.postcode}`;
    return mongoDoc;
  });
}


module.exports = transform;

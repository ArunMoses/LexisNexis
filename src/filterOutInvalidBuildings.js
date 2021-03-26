function filterOutInvalidBuildings(buildings) {
  return buildings.filter(building => (building.name) ? building : null);
}


module.exports = filterOutInvalidBuildings;

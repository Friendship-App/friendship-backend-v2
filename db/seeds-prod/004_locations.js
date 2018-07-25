const simpleFixtures = require('simple-fixtures');

const locations = [
  { active: true, id: '1', name: 'Ahvenanmaa', nameSv: 'Ahvenanmaa' },
  { active: true, id: '2', name: 'Espoo', nameSv: 'Espoo' },
  { active: true, id: '3', name: 'Helsinki', nameSv: 'Helsinki' },
  { active: true, id: '4', name: 'Hämeenlinna', nameSv: 'Hämeenlinna' },
  { active: true, id: '5', name: 'Imatra', nameSv: 'Imatra' },
  { active: true, id: '6', name: 'Joensuu', nameSv: 'Joensuu' },
  { active: true, id: '7', name: 'Jyväskylä', nameSv: 'Jyväskylä' },
  { active: true, id: '8', name: 'Kajaani', nameSv: 'Kajaani' },
  { active: true, id: '9', name: 'Kokkola', nameSv: 'Kokkola' },
  { active: true, id: '10', name: 'Kuopio', nameSv: 'Kuopio' },
  { active: true, id: '11', name: 'Lahti', nameSv: 'Lahti' },
  { active: true, id: '12', name: 'Lappeenranta', nameSv: 'Lappeenranta' },
  { active: true, id: '13', name: 'Mikkeli', nameSv: 'Mikkeli' },
  { active: true, id: '14', name: 'Oulu', nameSv: 'Oulu' },
  { active: true, id: '15', name: 'Pietarsaari', nameSv: 'Pietarsaari' },
  { active: true, id: '16', name: 'Pori', nameSv: 'Pori' },
  { active: true, id: '17', name: 'Rovaniemi', nameSv: 'Rovaniemi' },
  { active: true, id: '18', name: 'Savonlinna', nameSv: 'Savonlinna' },
  { active: true, id: '19', name: 'Seinäjoki', nameSv: 'Seinäjoki' },
  { active: true, id: '20', name: 'Tampere', nameSv: 'Tampere' },
  { active: true, id: '21', name: 'Tornio', nameSv: 'Tornio' },
  { active: true, id: '22', name: 'Turku', nameSv: 'Turku' },
  { active: true, id: '23', name: 'Vaasa', nameSv: 'Vaasa' },
  { active: true, id: '24', name: 'Vantaa', nameSv: 'Vantaa' },
  { active: true, id: '25', name: 'Kotka', nameSv: 'Kotka' },
  { active: true, id: '26', name: 'Kouvola', nameSv: 'Kouvola' },
];

let locationIndex = -1;
const getLocation = () => {
  locationIndex += 1;
  return locations[locationIndex].name;
};

const locationFields = {
  name: () => getLocation(),
};

exports.seed = knex =>
  knex.batchInsert(
    'locations',
    simpleFixtures.generateFixtures(locationFields, locations.length),
  );

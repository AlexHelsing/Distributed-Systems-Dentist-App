const dentistries = [
  {
    name: 'Dentistry 1',
    id: '1',
    rating: 3,
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',
    slots: [
      {
        id: '1',
        patientId: '1',
        dentistId: '1',
        start: new Date('2023-11-28T10:00:00'),
        end: new Date('2023-11-28T11:00:00'),
        date: new Date('2023-11-28'),
      },
      {
        id: '2',
        patientId: '2',
        dentistId: '1',
        start: new Date('2020-01-01T11:00:00'),
        end: new Date('2020-01-01T12:00:00'),
        date: new Date('2020-11-24'),
      },
      {
        id: '3',
        patientId: '3',
        dentistId: '1',
        start: new Date('2020-01-01T13:00:00'),
        end: new Date('2020-01-01T14:00:00'),
        date: new Date('2020-11-25'),
      },
      {
        id: '4',
        patientId: '4',
        dentistId: '1',
        start: new Date('2020-01-01T14:00:00'),
        end: new Date('2020-01-01T15:00:00'),
        date: new Date('2020-01-01'),
      },
      {
        id: '5',
        patientId: '5',
        dentistId: '1',
        start: new Date('2020-01-01T15:00:00'),
        end: new Date('2020-01-01T16:00:00'),
        date: new Date('2020-01-01'),
      },
      {
        id: '6',
        patientId: '6',
        dentistId: '1',
        start: new Date('2020-01-01T16:00:00'),
        end: new Date('2020-01-01T17:00:00'),
        date: new Date('2020-01-01'),
      },
    ],
    type: 'tooth',
    coordinates: {
      lat: 57.69887,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 2',
    id: '2',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',
    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.70777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 3',
    id: '3',
    rating: 4.5,
    slots: [],
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    type: 'tooth',
    coordinates: {
      lat: 57.71877,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 4',
    id: '4',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.72777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 5',
    id: '5',
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    rating: 4.5,
    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.66777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 6',
    id: '6',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.65677,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 7',
    id: '7',
    rating: 4.5,
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.64777,
      lng: 11.96456,
    },
  },
  {
    name: 'Dentistry 8',
    id: '8',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.45777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 9',
    id: '9',
    rating: 4.5,
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.44777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 10',
    id: '10',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.43777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 11',
    id: '11',
    rating: 4.5,
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.42777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 12',
    id: '12',
    rating: 4.5,
    photo:
      'https://i1.wp.com/www.indiadesignworld.com/wp-content/uploads/2022/10/1.-House-of-Ruya_32-Smiles-Dental-Clinic_DSC03993-copy-2.jpg?resize=1440%2C960&ssl=1',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.41777,
      lng: 11.97456,
    },
  },
  {
    name: 'Dentistry 13',
    id: '13',
    rating: 4.5,
    photo:
      'https://images.squarespace-cdn.com/content/v1/5e29bc191bc1146fbde14230/1647595177138-VSFKCXFMFIGNSU2BKQMI/dental+surgery+design.jpeg',

    slots: [],
    type: 'tooth',
    coordinates: {
      lat: 57.40777,
      lng: 11.97456,
    },
  },
];

export default dentistries;

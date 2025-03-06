const translators = [
    {
        city: 'Buenos Aires',
        address: 'Melincué 3300, C1417 CABA',
        phone: '011 3527-0216',
        latitude: -34.60320302712221,
        longitude: -58.49412844032177
    },
    {
        city: 'Buenos Aires',
        address: 'Av. Corrientes 1832 4ºA, C1045 CABA',
        phone: '011 4371-6950',
        latitude: -34.604546471420285,
        longitude: -58.392825536216215
    },
    {
        city: 'Quilmes, Provincia de Buenos Aires',
        address: 'Alvear entre Echeverria y Lugones, Alvear, B1878 Quilmes',
        phone: '',
        latitude: -34.73735561702126,
        longitude: -58.24233406145893
    },
    {
        city: 'Buenos Aires',
        address: 'Godoy Cruz 1700, C1414 CABA',
        phone: '011 6598-3311',
        latitude: -34.58730536143084,
        longitude: -58.43381824087754
    },
    {
        city: 'Buenos Aires',
        address: 'Albariño 1187, C1440 CABA',
        phone: '011 3945-0205',
        latitude: -34.64922286008588,
        longitude: -58.49813710064918
    },
    {
        city: 'Buenos Aires',
        address: 'Manuel Ugarte 2187 1 º piso, C1428BSE CABA',
        phone: '011 4896-2693',
        latitude: -34.55513124834484,
        longitude: -58.45950011404081
    },
    {
        city: 'Buenos Aires',
        address: 'Alejandro Magariños Cervantes 3274, C1416 CABA',
        phone: '011 4567-1812',
        latitude: -34.61596491540296,
        longitude: -58.484444773956035
    },
    {
        city: 'Buenos Aires',
        address: 'B1646 San Fernando, Provincia de Buenos Aires',
        phone: '011 3212-6804',
        latitude: -34.445121716474745,
        longitude: -58.55801238918563
    },
    {
        city: 'Buenos Aires',
        address: 'Av. Directorio 3239 2° "D, C1406 CABA',
        phone: '011 15-3163-6176',
        latitude: -34.63670179710814,
        longitude: -58.471871860649
    },
    {
        city: 'Buenos Aires',
        address: 'Av. Corrientes 1386 piso 9, C1043 CABA',
        phone: '011 3945-0205',
        latitude: -34.60408685612917,
        longitude: -58.38620833058094
    },
    {
        city: 'Buenos Aires',
        address: 'C. 9 244, B1906 Tolosa, Provincia de Buenos Aires',
        phone: '0221 400-0860',
        latitude: -34.900454235414365,
        longitude: -57.9737961888095
    },
    {
        city: 'Buenos Aires',
        address: '9 de Julio 127 2 C, B1708 Morón, Provincia de Buenos Aires',
        phone: '011 4483-0050',
        latitude: -34.64973317058522,
        longitude: -58.61862989802642
    },
    {
        city: 'Buenos Aires',
        address: 'Av. Gral. Las Heras 1983, C1127 CABA',
        phone: '011 15-5525-2746',
        latitude: -34.59015385432371,
        longitude: -58.39359896323953
    },
    {
        city: 'Buenos Aires',
        address: 'Riobamba 429 piso 9, oficina 911, C1025 CABA',
        phone: '011 4416-6928',
        latitude: -34.60396517155092,
        longitude: -58.393835352189846
    },
    {
        city: 'Buenos Aires',
        address: '262, B1837 Sourigues, Provincia de Buenos Aires',
        phone: '',
        latitude: -34.79638361836627,
        longitude: -58.21691735320395
    },
    {
        city: 'Buenos Aires',
        address: 'Cdad. de La Paz 1638, C1426 CABA',
        phone: '011 6699-5708',
        latitude: -34.56677105305079,
        longitude: -58.45430200622976
    },
    {
        city: 'Buenos Aires',
        address: 'en OficinAhora, Av. Belgrano 687 8º Piso, Oficina 33, C1070 CABA',
        phone: '011 5984-2530',
        latitude: -34.61255551735907,
        longitude: -58.37609963105145
    },
    {
        city: 'Buenos Aires',
        address: 'Centro Comercial Nordelta, Circular Coworking, Av. de los Lagos 7008, B1670 Rincón de Milberg, Provincia de Buenos Aires',
        phone: '011 2397-9537',
        latitude: -34.39890769614357,
        longitude: -58.652058140757724
    },
    {
        city: 'Buenos Aires',
        address: 'José Ignacio Gorriti 2, B1832IVB Lomas de Zamora, Provincia de Buenos Aires',
        phone: '011 4243-2095',
        latitude: -34.76234101091838,
        longitude: -58.39788013345051
    },
    {
        city: 'Buenos Aires',
        address: 'Av. Sta. Fe 3681, C1425 CABA',
        phone: '011 3074-2850',
        latitude: -34.58515659904285,
        longitude: -58.41559015229227
    },
    {
        city: 'Cordoba',
        address: 'Blvd. San Juan 1297, X5000 Córdoba',
        phone: '0351 15-229-0077',
        latitude: -31.41664098823729,
        longitude: -64.2039499678271
    },
    {
        city: 'Mar del Plata',
        address: 'Estudio Juridico, Santiago del Estero 3571, B7600 Mar del Plata, Provincia de Buenos Aires',
        phone: '0223 680-3614',
        latitude: -38.014859910975545,
        longitude: -57.558073017817584
    },
    {
        city: 'Entre Rios',
        address: '25 de Junio 521, Paraná, Entre Ríos',
        phone: '0343 455-7249',
        latitude: -31.72878229127632,
        longitude: -60.53698673991422
    },
    {
        city: 'Santa Fe',
        address: 'Blvd. Oroño 1567, S2000 Rosario, Santa Fe',
        phone: '0341 424-2568',
        latitude: -32.95308416686173,
        longitude: -60.65539806113409
    },
    {
        city: 'Santa Fe',
        address: 'Corvalán 444, S2000 Rosario, Santa Fe',
        phone: '0341 689-5351',
        latitude: -32.923940773489214,
        longitude: -60.67001433468824
    },
    {
        "city": "Entre Rios",
        "address": "Monseñor José Dobler 1280, E3100 Paraná, Entre Ríos",
        "phone": "0343 465-1173",
        "latitude": -31.733480975278553,
        "longitude": -60.49706462840323
    },
    {
        "city": "Mar del Plata",
        "address": "Olavarría 2663, B7600 Mar del Plata, Provincia de Buenos Aires",
        "phone": "0223 451-6116",
        "latitude": -38.013256632045625,
        "longitude": -57.54119857856881
    },
    {
        "city": "La Pampa",
        "address": "Sarmiento 65, L6300ALA Santa Rosa, La Pampa",
        "phone": "02954 15-33-1060",
        "latitude": -36.617922287287904,
        "longitude": -64.29208473720031
    },
    {
        "city": "Rio Negro",
        "address": "Juan José Paso, R8400 San Carlos de Bariloche, Río Negro",
        "phone": "0221 524-8832",
        "latitude": -41.13609992047724,
        "longitude": -71.31221378361255
    },
    {
        "city": "Cordoba",
        "address": "Obispo Trejo 825 - PB G, 5000 Córdoba",
        "phone": "0351 15-421-8663",
        "latitude": -31.425518511993698,
        "longitude": -64.18935196354221
    },
    {
        "city": "Santiago del Estero",
        "address": "Independencia 341, G4200 Santiago del Estero",
        "phone": "0385 620-2796",
        "latitude": -27.78997938675287,
        "longitude": -64.25680295491217
    },
    {
        "city": "Cordoba",
        "address": "Gral. Paz 108, X5022 Córdoba",
        "phone": "",
        "latitude": -31.41397571302596,
        "longitude": -64.18610370656353
    }
]


export default translators
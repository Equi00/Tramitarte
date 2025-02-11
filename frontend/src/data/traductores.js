const traductores = [
    {
        ciudad: 'Buenos Aires',
        direccion: 'Melincué 3300, C1417 CABA',
        telefono: '011 3527-0216',
        latitud: -34.60320302712221,
        longitud: -58.49412844032177
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Av. Corrientes 1832 4ºA, C1045 CABA',
        telefono: '011 4371-6950',
        latitud: -34.604546471420285,
        longitud: -58.392825536216215
    },
    {
        ciudad: 'Quilmes, Provincia de Buenos Aires',
        direccion: 'Alvear entre Echeverria y Lugones, Alvear, B1878 Quilmes',
        telefono: '',
        latitud: -34.73735561702126,
        longitud: -58.24233406145893
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Godoy Cruz 1700, C1414 CABA',
        telefono: '011 6598-3311',
        latitud: -34.58730536143084,
        longitud: -58.43381824087754
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Albariño 1187, C1440 CABA',
        telefono: '011 3945-0205',
        latitud: -34.64922286008588,
        longitud: -58.49813710064918
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Manuel Ugarte 2187 1 º piso, C1428BSE CABA',
        telefono: '011 4896-2693',
        latitud: -34.55513124834484,
        longitud: -58.45950011404081
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Alejandro Magariños Cervantes 3274, C1416 CABA',
        telefono: '011 4567-1812',
        latitud: -34.61596491540296,
        longitud: -58.484444773956035
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'B1646 San Fernando, Provincia de Buenos Aires',
        telefono: '011 3212-6804',
        latitud: -34.445121716474745,
        longitud: -58.55801238918563
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Av. Directorio 3239 2° "D, C1406 CABA',
        telefono: '011 15-3163-6176',
        latitud: -34.63670179710814,
        longitud: -58.471871860649
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Av. Corrientes 1386 piso 9, C1043 CABA',
        telefono: '011 3945-0205',
        latitud: -34.60408685612917,
        longitud: -58.38620833058094
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'C. 9 244, B1906 Tolosa, Provincia de Buenos Aires',
        telefono: '0221 400-0860',
        latitud: -34.900454235414365,
        longitud: -57.9737961888095
    },
    {
        ciudad: 'Buenos Aires',
        direccion: '9 de Julio 127 2 C, B1708 Morón, Provincia de Buenos Aires',
        telefono: '011 4483-0050',
        latitud: -34.64973317058522,
        longitud: -58.61862989802642
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Av. Gral. Las Heras 1983, C1127 CABA',
        telefono: '011 15-5525-2746',
        latitud: -34.59015385432371,
        longitud: -58.39359896323953
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Riobamba 429 piso 9, oficina 911, C1025 CABA',
        telefono: '011 4416-6928',
        latitud: -34.60396517155092,
        longitud: -58.393835352189846
    },
    {
        ciudad: 'Buenos Aires',
        direccion: '262, B1837 Sourigues, Provincia de Buenos Aires',
        telefono: '',
        latitud: -34.79638361836627,
        longitud: -58.21691735320395
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Cdad. de La Paz 1638, C1426 CABA',
        telefono: '011 6699-5708',
        latitud: -34.56677105305079,
        longitud: -58.45430200622976
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'en OficinAhora, Av. Belgrano 687 8º Piso, Oficina 33, C1070 CABA',
        telefono: '011 5984-2530',
        latitud: -34.61255551735907,
        longitud: -58.37609963105145
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Centro Comercial Nordelta, Circular Coworking, Av. de los Lagos 7008, B1670 Rincón de Milberg, Provincia de Buenos Aires',
        telefono: '011 2397-9537',
        latitud: -34.39890769614357,
        longitud: -58.652058140757724
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'José Ignacio Gorriti 2, B1832IVB Lomas de Zamora, Provincia de Buenos Aires',
        telefono: '011 4243-2095',
        latitud: -34.76234101091838,
        longitud: -58.39788013345051
    },
    {
        ciudad: 'Buenos Aires',
        direccion: 'Av. Sta. Fe 3681, C1425 CABA',
        telefono: '011 3074-2850',
        latitud: -34.58515659904285,
        longitud: -58.41559015229227
    },
    {
        ciudad: 'Cordoba',
        direccion: 'Blvd. San Juan 1297, X5000 Córdoba',
        telefono: '0351 15-229-0077',
        latitud: -31.41664098823729,
        longitud: -64.2039499678271
    },
    {
        ciudad: 'Mar del Plata',
        direccion: 'Estudio Juridico, Santiago del Estero 3571, B7600 Mar del Plata, Provincia de Buenos Aires',
        telefono: '0223 680-3614',
        latitud: -38.014859910975545,
        longitud: -57.558073017817584
    },
    {
        ciudad: 'Entre Rios',
        direccion: '25 de Junio 521, Paraná, Entre Ríos',
        telefono: '0343 455-7249',
        latitud: -31.72878229127632,
        longitud: -60.53698673991422
    },
    {
        ciudad: 'Mar del Plata',
        direccion: 'Gral. Rivas 4460, B7602DNH Mar del Plata, Provincia de Buenos Aires',
        telefono: '0223 15-526-7966',
        latitud: -38.03119417279154,
        longitud: -57.54569005051037
    },
    {
        ciudad: 'Mar del Plata',
        direccion: 'Córdoba 1882 8º - 81, B7600 Mar del Plata, Provincia de Buenos Aires',
        telefono: '0223 455-1969',
        latitud: -38.0009214903564,
        longitud: -57.54796580337682
    },
    {
        ciudad: 'Santa Fe',
        direccion: 'Blvd. Oroño 1567, S2000 Rosario, Santa Fe',
        telefono: '0341 424-2568',
        latitud: -32.95308416686173,
        longitud: -60.65539806113409
    },
    {
        ciudad: 'Santa Fe',
        direccion: 'Corvalán 444, S2000 Rosario, Santa Fe',
        telefono: '0341 689-5351',
        latitud: -32.923940773489214,
        longitud: -60.67001433468824
    },
    {
        ciudad: 'Entre Rios',
        direccion: 'Monseñor José Dobler 1280, E3100 Paraná, Entre Ríos',
        telefono: '0343 465-1173',
        latitud: -31.733480975278553,
        longitud: -60.49706462840323
    },
    {
        ciudad: 'Mar del Plata',
        direccion: 'Olavarría 2663, B7600 Mar del Plata, Provincia de Buenos Aires',
        telefono: '0223 451-6116',
        latitud: -38.013256632045625,
        longitud: -57.54119857856881
    },
    {
        ciudad: 'La Pampa',
        direccion: 'Sarmiento 65, L6300ALA Santa Rosa, La Pampa',
        telefono: '02954 15-33-1060',
        latitud: -36.617922287287904,
        longitud: -64.29208473720031
    },
    {
        ciudad: 'Rio Negro',
        direccion: 'Juan José Paso, R8400 San Carlos de Bariloche, Río Negro',
        telefono: '0221 524-8832',
        latitud: -41.13609992047724,
        longitud: -71.31221378361255
    },
    {
        ciudad: 'Cordoba',
        direccion: 'Obispo Trejo 825 - PB G, 5000 Córdoba',
        telefono: '0351 15-421-8663',
        latitud: -31.425518511993698,
        longitud: -64.18935196354221
    },
    {
        ciudad: 'Santiago del Estero',
        direccion: 'Independencia 341, G4200 Santiago del Estero',
        telefono: '0385 620-2796',
        latitud: -27.78997938675287,
        longitud: -64.25680295491217
    },
    {
        ciudad: 'Cordoba',
        direccion: 'Gral. Paz 108, X5022 Córdoba',
        telefono: '',
        latitud: -31.41397571302596,
        longitud: -64.18610370656353
    }
]


export default traductores
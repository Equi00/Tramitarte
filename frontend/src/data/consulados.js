const consulados = [
    {
        ciudad: 'Ciudad de Buenos Aires',
        direccion: 'Reconquista 572',
        telefono: '(011) 4114-4800',
        latitud: -34.6012057,
        longitud: -58.3753164,
        url: 'https://consbuenosaires.esteri.it'
    },
    {
        ciudad: 'Bahía Blanca',
        direccion: 'Av. Alem 309',
        telefono: '(291) 454-4731',
        latitud: -38.7114977,
        longitud: -62.2648629,
        url: 'https://consbahiablanca.esteri.it'
    },
    {
        ciudad: 'La Plata',
        direccion: 'Calle 48 Nº 869',
        telefono: '(221) 439-5500',
        latitud: -34.918791,
        longitud: -57.9589888,
        url: 'https://conslaplata.esteri.it'
    },
    {
        ciudad: 'Lomas de Zamora',
        direccion: 'Av. Meeks 701',
        telefono: '(011) 42927954',
        latitud: -34.7702763,
        longitud: -58.4031475,
        url: 'https://conslomasdezamora.esteri.it'
    },
    {
        ciudad: 'Mar del Plata',
        direccion: 'Falucho 1416',
        telefono: '(223) 451-77034',
        latitud: -38.0112061,
        longitud: -57.5424272,
        url: 'https://consmardelplata.esteri.it'
    },
    {
        ciudad: 'Mercedes',
        direccion: 'Reconquista 572',
        telefono: '(232) 442-4043',
        latitud: -34.6537394,
        longitud: -59.437587,
        url: 'consmercedes@yahoo.it'
    },
    {
        ciudad: 'Merlo',
        direccion: 'Vicente López 37',
        telefono: '+54 2204821978',
        latitud: -34.6727519,
        longitud: -58.7292109,
        url: ''
    },
    {
        ciudad: 'Morón',
        direccion: 'República Oriental del Uruguay 129',
        telefono: '(011) 4489-1615',
        latitud: -34.6497115,
        longitud: -58.620235,
        url: 'https://consmoron.esteri.it'
    },
    {
        ciudad: 'Necochea',
        direccion: 'Calle 50 Nº 3197',
        telefono: '(226) 2528373',
        latitud: -38.5599138,
        longitud: -58.7406313,
        url: ''
    },
    {
        ciudad: 'Olavarría',
        direccion: 'Rivadavia 2683',
        telefono: '(228) 444-1371',
        latitud: -36.8945266,
        longitud: -60.3284257,
        url: ''
    },
    {
        ciudad: 'Pergamino',
        direccion: 'Av. Rocha 364/366',
        telefono: '(011) 4114-4800',
        latitud: -33.8948931,
        longitud: -60.5678748,
        url: 'pergamino.onorario@esteri.it'
    },
    {
        ciudad: 'San Isidro',
        direccion: 'Obispo Terrero 95',
        telefono: '(011) 4743-5776',
        latitud: -34.4738777,
        longitud: -58.5197323,
        url: ''
    },
    {
        ciudad: 'Ciudad de Buenos Aires',
        direccion: 'Reconquista 572',
        telefono: '(011) 4114-4800',
        latitud: -34.6012057,
        longitud: -58.3753164,
    },
    {
        ciudad: 'Tandil',
        direccion: 'San Martín 190',
        telefono: 'Sin teléfono',
        latitud: -34.6012057,
        longitud: -58.3753164,
        url: 'https://tandil.onorario@esteri.it'
    },
    {
        ciudad: 'Tres Arroyos',
        direccion: 'Lavalle 556',
        telefono: '(298) 342-9575',
        latitud: -38.3663615,
        longitud: -60.3261533,
        url: ''
    },
    {
        ciudad: 'Tres de Febrero',
        direccion: 'Bazzini 1051',
        telefono: 'Sin teléfono',
        latitud: -34.584396,
        longitud: -58.583561,
        url: ''
    },
    {
        ciudad: 'Córdoba',
        direccion: 'Av. Vélez Sarsfield 360',
        telefono: '(351)526-1000',
        latitud: -31.4192225,
        longitud: -64.1911779,
        url: 'https://conscordoba.esteri.it'
    },
    {
        ciudad: 'Las Varillas',
        direccion: 'Italia 354',
        telefono: '(353) 352-1085',
        latitud: -31.3868138,
        longitud: -64.2146967,
        url: ''
    },
    {
        ciudad: 'Río Cuarto',
        direccion: 'Colón 243',
        telefono: '(358) 462-3528',
        latitud: -31.4043239,
        longitud: -64.2189744,
        url: ''
    },
    {
        ciudad: 'San Francisco',
        direccion: 'Av. Libertador Norte Nº 99',
        telefono: '(356) 444-3200',
        latitud: -31.4285977,
        longitud: -62.0874152,
        url: ''
    },
    {
        ciudad: 'Villa María',
        direccion: 'Salta 1481',
        telefono: 'Sin teléfono',
        latitud: -32.4037218,
        longitud: -63.2485202,
        url: 'agenteconsolare.villamaria@gmail.com'
    },
    {
        ciudad: 'Mendoza',
        direccion: 'Necochea 712',
        telefono: '(261) 520-1400',
        latitud: -32.8910571,
        longitud: -68.8235266,
        url: 'https://consmendoza.esteri.it'
    },
    {
        ciudad: 'San Rafael',
        direccion: 'Francia 113',
        telefono: '(262) 742-0373',
        latitud: -34.6143651,
        longitud: -68.3298975,
        url: ''
    },
    {
        ciudad: 'Villa Mercedes',
        direccion: 'Belgrano 160',
        telefono: '(265) 743-4852',
        latitud: -33.9076352,
        longitud: -67.4521805,
        url: ''
    },
    {
        ciudad: 'Rosario',
        direccion: 'Alvear 360',
        telefono: '(349) 242-8615',
        latitud: -32.9383486,
        longitud: -60.6582339,
        url: ''
    },
    {
        ciudad: 'Catamarca',
        direccion: 'Mariano Moreno 554',
        telefono: '(383) 343-2699',
        latitud: -28.4683177,
        longitud: -65.7903901,
        url: ''
    },
    {
        ciudad: 'Resistencia',
        direccion: 'Julio A. Roca 1799',
        telefono: '(372) 245-0008',
        latitud: -27.6783402,
        longitud: -60.9150154,
        url: ''
    },
    {
        ciudad: 'Puerto Madryn',
        direccion: '28 de Julio 129',
        telefono: '(296) 545-3369',
        latitud: -42.7661932,
        longitud: -65.0379677,
        url: ''
    },
    {
        ciudad: 'Santa rosa de Toay',
        direccion: 'Pellegrini 444',
        telefono: '(295) 442-6206',
        latitud: -36.6214729,
        longitud: -64.2975143,
        url: ''
    },
    {
        ciudad: 'El Dorado - Misiones',
        direccion: '',
        telefono: '(011) 4114-4800',
        latitud: -26.410332,
        longitud: -54.6299261,
        url: 'https://eldoraro.onorario@esteri.it'
    },
    {
        ciudad: 'Viedma',
        direccion: 'Gallardo 17',
        telefono: '(292) 042-3328',
        latitud: -40.8092283,
        longitud: -62.9922497,
        url: ''
    },
    {
        ciudad: 'Salta',
        direccion: 'Santiago del Estero 497',
        telefono: '(387) 432-1532',
        latitud: -24.7852368,
        longitud: -65.4113697,
        url: ''
    },
    {
        ciudad: 'San Juan',
        direccion: 'Av. Ignacio de la Roza 2174',
        telefono: '(011) 4114-4800',
        latitud: -31.538537,
        longitud: -68.5592937,
        url: 'https://sanjuan.onorario@esteri.it'
    },
    {
        ciudad: 'San Luis',
        direccion: 'Ruta 7 km 773.5, Juana Koslay',
        telefono: '(265) 245-9529',
        latitud: -34.5945642,
        longitud: -60.9850346,
        url: ''
    },
    {
        ciudad: 'San Salvador de Jujuy',
        direccion: 'Av. José Fascio 1050',
        telefono: '(0388) 426-1898',
        latitud: -24.1809766,
        longitud: -65.3104802,
        url: 'https://jujuy.onorario@esteri.it'
    },
    {
        ciudad: 'Santiago del Estero',
        direccion: 'Reconquista 572',
        telefono: '(385) 421-2728',
        latitud: -27.787784,
        longitud: -64.2705206,
        url: ''
    },
    {
        ciudad: 'Usuahia',
        direccion: 'Los Salesianos 3537',
        telefono: '(290) 150-1794',
        latitud: -54.8408827,
        longitud: -68.3745423,
        url: ''
    },
    {
        ciudad: 'Tucumán',
        direccion: '24 de Septiembre 1021',
        telefono: '(381) 422-3830',
        latitud: -26.8308345,
        longitud: -65.2103477,
        url: ''
    },
]

export default consulados;
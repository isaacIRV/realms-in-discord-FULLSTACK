import EspadachinSolar from '../assets/cards/tropa_2.png';
import SacerdoteSolar from '../assets/cards/tropa_10.png';
import PortaEstandarte from '../assets/cards/tropa_11.png';
import AlabarderoReal from '../assets/cards/tropa_6.png';
import HeroeSolar from '../assets/cards/heroe_1_1.png';
import ReyPaladin from '../assets/cards/tropa_4.png'; 
import MagoDeBatalla from '../assets/cards/tropa_5.png';
import AvatarDeLaLuz from '../assets/cards/tropa_9.png';

export const cards = [
    {
        id: "CS001",
        name: "Espadachin Solar",
        cost: 2,
        attack: 3,
        health: 2,
        image: EspadachinSolar,
        faction: "Caballeros Solarees",
        description: "Tropa Comun"
    },

    {
        id: "CS002",
        name: "Sacerdote Solar",
        cost: 3,
        attack: 1,
        health: 4,
        image: SacerdoteSolar,
        faction: "Caballeros Solarees",
        description: "Al final de cada turno, helea +1 PS a la tropa mas cercana"

    },

     {
        id: "CS003",
        name: "Porta Estandarte",
        cost: 4,
        attack: 3,
        health: 4,
        image: PortaEstandarte,
        faction: "Caballeros Solarees" ,
        description: "Tropas cercanas obtienen +1 AD"
    },

     {
        id: "CS004",
        name: "Alabardero Real",
        cost: 5,
        attack: 5,
        health: 4,
        image: AlabarderoReal,
        faction: "Caballeros Solarees",
        description: "Puede atacar a multiples objetivos" 
    },

     {
        id: "CS005",
        name: "Heroe Solar",
        cost: 4,
        attack: 4,
        health: 5,
        image: HeroeSolar,
        faction: "Caballeros Solarees", 
        description: ""
    },

     {
        id: "CS006",
        name: "Rey Paladin",
        cost: 7,
        attack: 5,
        health: 7,
        image: ReyPaladin,
        faction: "Caballeros Solarees",
        description: "En toda su fila genera estado de 'SEGURIDAD' + 1 AR/MR"
    },

     {
        id: "CS007",
        name: "Mago de Batalla",
        cost: 3,
        attack: 3,
        health: 3,
        image: MagoDeBatalla,
        faction: "Caballeros Solarees", 
        description: "Al aparecer en el mazo quita -1PS a la carta que este en casilla espejo"

    },

    {
        id: "CS008",
        name: "Avatar de la Luz",
        cost: 10,
        attack: 8,
        health: 8,
        image: AvatarDeLaLuz,
        faction: "Caballeros Solarees",
        description: "Estado permanente de 'INMUNE', no puede atacar en primer turno, no recibe daño de magias"
    },
    
];

export default cards;
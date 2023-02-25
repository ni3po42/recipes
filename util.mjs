
export const attributes = {
    'isSlowCook' : 'bool',
    'isQuick' : 'bool',
    'bad' : 'bool'
};

export const books = [
    'Blue Apron',
    'BHG Slow Cooker',
    'Food and Wine',
    'Das Garten Haus',
    'Bobs Burgers',
    'Google Drive',
    'Box',
    'Power XL',
    'Crockpot',
    '5 Ingredient Slow Cooker',
    'online'
]

export const units = [
    'ct',
    'cup',
    'quart',
    'tbsp',
    'tsp',
    'fl-oz',
    'lb',
    'oz'
];

const volume = [
'quart',
'cup',
'fl-oz',
'tbsp',
'tsp'
];

const isVolume = new Set(volume);

const weight = [ 'lb',
'oz'];

export function aggregateIngredient(list) {
    const counts = list.filter(x=> x.unit === 'ct');
    const measures = list.filter(x=> x.unit !== 'ct');

    const volumeMeasures = measures.filter(x=> isVolume(x.unit));
    const weightMeasures = measures.filter(x=> !isVolume(x.unit));

    const maxVol = volumeMeasures[volumeMeasures.map(x=> volume.indexOf(x.unit)).reduce((a,b)=> a < b ? a : b,999)];
    const maxWeight = weightMeasures[weightMeasures.map(x=> weight.indexOf(x.unit)).reduce((a,b)=> a < b ? a : b,999)];

    const vols = volumeMeasures.map(x=>{

        switch(maxVol.unit + x) {
            case 'quartcup': 
                return x.size / 4;
            case 'quarttbsp':
                return x.size / 64;
            case 'quarttsp': 
                return x.size / 192;
            case 'quartfl-oz': 
                return x.size / 32;

            case 'cuptbsp':
                return x.size / 16;
            case 'cuptsp':
                return x.size / 48;
            case 'cupfl-oz': 
                return x.size / 8;

            case 'fl-oztbsp':
                return x.size / 2;
            case 'fl-oztsp':
                return x.size / 6;
                
            case 'tbsptsp':
                return x.size / 3;

            default: return x.size;
            
        }

    });

    const wei = weightMeasures.map(x=>{

        switch(maxVol.unit + x) {
            case 'lboz': x.size / 16;
            default: return x.size;
        }
    });

    return [...counts, ...vols, ...wei];
}

export async function choose(rl, name, list, options) {

    const selector = options?.selector ?? ((obj)=>obj);
    const display = options?.display ?? ((obj)=>obj);
    const cancel = options?.cancel ?? false;

    list.forEach((item, i)=> console.log(`${i}. ${display(item)}`));

    if (cancel) {
        console.log(`${list.length}. **CANCEL**`);
    }

    let i = -1;

    while (!list[i] && i!==list.length) {
        i = +(await getText(rl, name));
    }

    if (cancel && i===list.length) {
        return undefined;
    }

    return selector(list[i]);
}

export async function yesOrNo(rl, phrase) {
    let valid = false;
    let r = '';
    while (!valid) {
        r = await getText(rl, `${phrase} (y/n)`, 'n');
        valid = r === 'y' || r === 'n';
    }
    return r === 'y';
}

export async function getText(rl, phrase, defaultOption) {
    return (await rl.question(`${phrase}: `)).trim() || defaultOption;
}

export async function getUntil(action, check) {
    let more = await check(undefined);
    let result;
    while(more) {
        result = await action();
        more = await check(result);
    }
    return result;
}

export async function getDate(rl, phrase) {

    const dateTicks = await getUntil(async ()=>{
        const dateInput = await getText(rl, phrase);
        return Date.parse(dateInput);
    }, (dateAsTick)=>{
        return dateAsTick === undefined || Number.isNaN(dateAsTick);
    });

    return new Date(dateTicks);

}
const yargs = require('yargs/yargs');
const crypto = require('crypto');

const {
    hideBin
} = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

// Getting list of urls from args;
const urls = [
    ...argv._, 
    'https://medium.com/bb-tutorials-and-thoughts/react-how-to-proxy-to-backend-server-5588a9e0347#:~:text=In%20React%2C%20the%20create%2Dreact,calls%20based%20on%20the%20URL.'
];
const crc32 = require('crc-32');
/**
 * Base62 characters
 * 62^6 = 56800235584 unique chars, if we need 6 characters
 * 62^7 = 3521614606208 unique chars, if we need 7 characters
 * 62^8 = 218340105584896
 */
const char = '01234abcdefghijklmnopqrstuvwxyz56789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Alternative  
    // 1. using node cryto module to  generate random bytes for specific length and then convert to base62
    // 2. using math.random method ( less stabler and more collision than crypto mod )
    // 3. convert character to bits , add extra time stamp bits, convert to integer and then to base62
    // 4. option using crc-32 to generate integer then to base62;


/**
 * option 4 : Using crc32
 */    
function toBase62ByCrc32(longUrl) {
    let value = Math.abs(crc32.str(longUrl));
    console.log(`Hashcode : ${value}`)
    let tinykey = '';
    while (value > 0) {
        const currentChar = char[Math.floor(value % 62)];
        tinykey += currentChar;
        value = Math.floor(value / 62);
    }

    return tinykey;
}

/**
 * option 1 : Using Crypto Module
 */    
function toBase62ByCrypto(longUrl, length=6) {
    if(length > 2**31-1) {
        length = 10;
    }

    const bufferArr = crypto.randomBytes(length);
    const base62Arr = bufferArr.map ( buff => {
        return buff & 61;
    });

    return base62Arr.reduce((a,c) => {
        return `${a}${char[c]}`;
    },'');
}

/**
 * option 2 : Using Math.random
 */    
function toBase62MathRandom(longUrl, length=6) {
    if(length > 2**31-1) {
        length = 10;
    }

    let tinyKey = '';

    for (let i = 0; i < length; i++) {
        const charIndex = Math.floor(Math.random() * 62);
        tinyKey += char[charIndex];
    }

    return tinyKey;
}

function toBase62(longUrl, type='crc32', length=6) {
    switch(type) {
        case 'crc32': {
            return toBase62ByCrc32(longUrl);
        }
        case 'crypto': {
            return toBase62ByCrypto(longUrl, length);
        }
        case 'random': {
            return toBase62MathRandom(longUrl, length);
        }
        default: { 
            return toBase62ByCrc32(longUrl);
        }
    }
}

module.exports = toBase62;

/**
 * Prints only when invoked from CLI or Terminal
 */
if (argv._.length) {
    urls
        .map(url => {
            return {
                src: url,
                short: toBase62(url)
            };
        })
        .forEach(shortObj => {
            console.log(`${shortObj.short} <=> ${shortObj.src}`);
        });
}
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

// Getting list of urls from args;
const urls = [...argv._, 'https://medium.com/bb-tutorials-and-thoughts/react-how-to-proxy-to-backend-server-5588a9e0347#:~:text=In%20React%2C%20the%20create%2Dreact,calls%20based%20on%20the%20URL.'];
const crc32 = require('crc-32');
/**
 * Base62 characters
 * 62^6 = 56800235584 unique chars, if we need 6 characters
 * 62^7 = 3521614606208 unique chars, if we need 7 characters
 */
const char = '01234abcdefghijklmnopqrstuvwxyz56789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(longUrl) {
    // Alternative  
    // 1. using node cryto module to  generate random bytes for specific length and then convert to base62
    // 2. using math.random method ( less stabler and more collision than crypto mod )
    // 3. convert character to bits , add extra time stamp bits, convert to integer and then to base62
    // 4. option using crc-32 to generate integer then to base62;

    var value = Math.abs(crc32.str(longUrl));
    console.log(`Hashcode : ${value}`)
    var tinykey = '';
    while(value > 0 ){
        var currentChar = char[Math.floor(value % 62)];
        tinykey += currentChar;
        value = Math.floor(value / 62);
    }

    return tinykey;
}

urls
    .map( url => {
        return { 
            src: url, 
            short: toBase62(url)
        };
    })
    .forEach( shortObj => {
        console.log(`${shortObj.short} <=> ${shortObj.src}`);
    });
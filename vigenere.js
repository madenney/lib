
const UNICODE_MIN = 33;
const UNICODE_MAX = 126;

// From char code to number:
    // const s = "hello"
    // console.log( s.charCodeAt(0) );
    // -> 104
// From number to char code:
    // console.log( String.fromCharCode(104) )
    // -> 'h'

console.log("File encryption/decryption");

if( process.argv.length !== 3 ){
    console.log("Error: Incorrect number of arguments. Expected 1 line to encrypt or 1 filename.");
    return;
}


const readline = require('readline').createInterface({input: process.stdin, output: process.stdout })
readline.question('Encrypt or Decrypt? (E/D)?:', option => {
    let _option = option.toLocaleLowerCase();
    if(!(_option === 'd' || _option === 'e' )){
        console.log(`Error: Invalid option - ${option}`);
        readline.close()
        return;
    }

    readline.question(`Input Key: `, (key) => {
        readline.close()
        if( key.length == 0 ){
            console.log("No key entered. Exiting code.")
            return;
        }

        let characterMap = createCharacterMap(key);
        if( _option === 'd' ){
            console.log("Decrypted File:");

            const filename = process.argv[2];
            const fs = require("fs");
            if( !fs.existsSync(filename) ){
                console.log(`Error: File not found - ${filename}`)
                return;
            }
            const lines = fs.readFileSync(filename).toString().split('\n');      
            lines.forEach(line => {
                let decryptedLine = decrypt( characterMap, line );
                console.log( decryptedLine );
            })
        } else {
            // encrypt
            console.log("Encrypted Line:")
            console.log( encrypt( characterMap, process.argv[2] ))
        }
    });

})


function decrypt(map,line){
    let decryptedLine = '';
    line.split('').forEach(( char, index ) => {
        let val = char.charCodeAt(0);
        let subtractor = map[ index % map.length ];
        let decryptedVal = val - subtractor;
        if( decryptedVal < UNICODE_MIN ){
            decryptedVal = UNICODE_MAX - ( UNICODE_MIN - decryptedVal );
        }
        decryptedLine += String.fromCharCode( decryptedVal );
    });
    return decryptedLine;
}

function encrypt(map,line){
    let encryptedLine = '';
    line.split('').forEach(( char, index ) => {
        let val = char.charCodeAt(0);
        let adder = map[ index % map.length ];
        let encryptedVal = val + adder;
        if( encryptedVal > UNICODE_MAX ){
            encryptedVal = UNICODE_MIN + ( encryptedVal - UNICODE_MAX );
        }
        encryptedLine += String.fromCharCode( encryptedVal );
    });
    return encryptedLine;
}

function createCharacterMap(key){
    return key.split('').map( k => k.charCodeAt(0) );
}

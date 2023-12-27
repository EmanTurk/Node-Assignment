import fs from 'fs';

async function main() {
    fs.writeFileSync('newFile.txt', 'Hello, this is a new file.');
    fs.copyFileSync('newFile.txt', 'copyOfNewFile.txt');
    fs.renameSync('copyOfNewFile.txt', 'renamedFile.txt');

    const files = fs.readdirSync('.');
    console.log('Files in the directory:', files);

    const content = fs.readFileSync('newFile.txt', 'utf8');
    console.log('Content of newFile.txt:', content);
}

main();

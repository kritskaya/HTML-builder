const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const FILENAME = 'bundle.css';
const styles = [];


async function mergeCSS(src, dst) {
	const srcPath = path.join(__dirname, src);
	const dstFilePath = path.join(__dirname, dst, FILENAME);

	let files = await fsPromises.readdir(srcPath);
	for (let file of files) {
		const stats = await fsPromises.stat(path.join(srcPath, file));

		if (stats.isFile() && path.extname(file) === '.css') {
			let stylesBuffer = await fsPromises.readFile(path.join(srcPath, file));
			styles.push(stylesBuffer);
		}
	}

	let start = true;
	for(let style of styles) {
		if (start) {
			await fsPromises.writeFile(dstFilePath, style);
			start = false;
		} else {
			await fsPromises.writeFile(dstFilePath, style, { flag: 'a' });
		}
		
	}
}


mergeCSS('styles', 'project-dist');
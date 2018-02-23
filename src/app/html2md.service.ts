import { html2md } from 'html2markdown';
import * as path from 'path';
import * as promisify from 'promisify-node';
import * as fse from 'fs-extra';
fse.ensureDir = promisify(fse.ensureDir);


export class GitService {
    constructor(private repoPath: string) {
        this.repoPath = this.repoPath;
    }

    headerHtml2md(header: any) {
        let str = '---\n';
        for ( const key in header ) {
            if (header.hasOwnProperty(key)) {
                str +=  key + ':' + header[key] + '\n';
            }
        }
        str += '---\n';
        return str;
    }

    writeHtml2md(file_name: string, header: any, body: string) {
        const header_md: string = this.headerHtml2md(header);
        const body_md: string = html2md(body);
        const md: string = header_md + body_md;
        fse.writeFile(path.join(this.repoPath, file_name), md, (err) => {
            if (err) {
                throw err;
            }
            console.log(file_name + ' is Saved!');
        });
    }
}

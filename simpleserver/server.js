const http = require('http');

const url = require('url');

const path = require('path');

const fs = require('fs');

const mimeTypes = {
    "html":"text/html",
    "jpeg":"image/jpeg",
    "jpg":"image/jpg",
    "png":"image/png",
    "js":"text/javascript",
    "css":"text/css"
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req,res)=>{
    var uri = url.parse(req.url).pathname;
    console.log('Loading'+uri);
    var filename = path.join(process.cwd(),unescape(uri));
    console.log('FileName:'+ filename);
    var stats;
    try{
        stats = fs.lstatSync(filename);
        if(stats.isFile()){
            var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
            console.log('Is File');
            res.writeHead(200,{'Content-type':mimeType});

            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        } else if(stats.isDirectory()){
            console.log('Is Directory');
            res.writeHead(302,{
                'Location':'index.html'
            });
            res.end();
        } else {
            res.writeHead(500,{'Content-type':'text/plain'});
            res.write('500 Internal Error\n');
            res.end();
        }
    } catch(e){
        res.writeHead(404, {'Content-type':'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }
});

server.listen(port, hostname =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
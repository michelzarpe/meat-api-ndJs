import * as restify from 'restify'

//criar o server
const server = restify.createServer({
    name:'meat-api', version:'1.0.0'
});

//***************************PLUGINS**********************************
//configuracao de plugin para pegar os parametros de url
server.use(restify.plugins.queryParser());


server.get('/hello',[(req,resp,next)=>{
    //passa para proxima callback
    return next();
    //return next(false) // termina por aqui mesmo
},(req,resp,next)=>{
    resp.json({message:'hello'});
    return next();
}])

server.get('/info',(req,resp,next)=>{
    resp.json({
        message:'Info Cliente',
        browser:req.userAgent(),
        method: req.method,
        url: req.href(),
        path: req.path(),
        query: req.query
    });
    return next();
})

//ouvir em determinada porta
server.listen(3000,()=>{
    console.log('api running http://localhost:3000')
})
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var shortid = require('shortid');
var _clienteList = [];

//app.use(express.static());

io.on('connection',function(socket){

  //Teste de Conexao
 socket.on('Ping',function(){
   socket.emit('Ping',{msg:"Servidor Online"});
 })//Fim Ping

 socket.on('Login',function(pack){

    //Criar variavel para representar o clientes
    user = {
      name:pack.Name,
      id:Math.random()
    }
    //Colocar os Clientes dentro da lista
    _clienteList.push(user);

   //Emitir uma mensagem para o cliente logado
   socket.emit('Login',{
     name: user.name,
     id: user.id
   });

   //Emitir mensagem para o usuário contendo a lista dos clientes logados

   for (var i = 0; i < _clienteList.length; i++) {
     socket.emit('LoginCliente',_clienteList[i]);
     socket.broadcast.emit('LoginCliente',_clienteList[i]);
   }//Fim For


 //Informação do Servidor
  console.log("Player Nome: "+ user.name + " está conectado ao servidor com o ID: " + user.id);
  console.log("Clientes ativos: " + _clienteList.length);

 })//Fim Login

socket.on('BatePapo',function(pack){
 //Enviar mensagens para todos os players onlines
 socket.emit('BatePapo',{
   msg:pack.name +" Diz: "+ pack.msg+"."

 });
 socket.broadcast.emit('BatePapoAll',{
   msg:pack.name +" Diz: "+ pack.msg+"."

 });

})//FimBatePapo

socket.on('RefreshList',function(){
  socket.emit('RefreshList');
  socket.broadcast.emit('RefreshList');

})//Fim BatePapoAll

})//Fim connection

http.listen(process.env.PORT || 3000, function(){

   console.log("---------Servidor Connectado-----------");
})

var webSocket = null; //la web socket de communication

function dispatchMessage(msg){
  if(msg.msg === undefined)
    return;

  var msgId = msg.msg;

  for(var msgAttendue in wantedMsg) { //Pour chaque type de message attendue...
    if(msgAttendue == msgId) //Si c'est le message recu...
    {
      var tousLesHandlerEnAttentePourCeMessage = wantedMsg[msgAttendue];
      if(msg.convId === undefined) //Si on est dans ce cas, c'est que c'est un broadcast du serveur
      {
        tousLesHandlerEnAttentePourCeMessage.forEach(function(handlerEnAttente){
          if(handlerEnAttente.convId == 0)
            handlerEnAttente.handler(msg); //Donc on transmet à tous les handlers attendant ce type de message
        })
      }
      else { //Si on est dans ce cas, c'est qu'on obtient un message issue d'une conversation
        var handlerToRemove = null;

          tousLesHandlerEnAttentePourCeMessage.some(function(handlerEnAttente){
          if(handlerEnAttente.convId == msg.convId){
            handlerEnAttente.handler(msg);
            handlerToRemove = handlerEnAttente
            return true;
          }
          return false;
        });

        if(handlerToRemove != null) //La conversation a recu sa réponse, on l'enlève de l'attente
          tousLesHandlerEnAttentePourCeMessage.splice(tousLesHandlerEnAttentePourCeMessage.indexOf(handlerToRemove), 1);
      }
      break;
    }
  }
}

function generateConversationId(){
  return Math.floor((Math.random() * 1000000) +1);
}

var wantedMsg = []; //All messages received and not wanted will be discarded

function sendMessage(msg, succesResponse, succesResponseHandler, failureResponse, failureResponseHandler)
{
  if(succesResponse !== undefined || failureResponse !== undefined)
  {
    msg.convId = generateConversationId();
  }

  if(succesResponse)
  {
    if(succesResponseHandler === undefined)
      throw "succesResponse without succesResponseHandler";

    msgWait = {
      convId : msg.convId !== undefined ? msg.convId : 0,
      handler : succesResponseHandler
    };

    if(wantedMsg[succesResponse] === undefined)
      wantedMsg[succesResponse] = [];

    wantedMsg[succesResponse].push(msgWait);
  }

  if(failureResponse)
  {
    if(failureResponseHandler === undefined)
      throw "failureResponse without failureResponseHandler";

    msgWait = {
      convId : msg.convId !== undefined ? msg.convId : 0,
      handler : failureResponseHandler
    };

    wantedMsg[failureResponse].push(msgWait);
  }

  var frame = JSON.stringify(msg);
  webSocket.send(frame);
}

/*sras.factory('Socket', function($websocet, state){
  var socket = $websocet('ws://62.210.100.11:21194/');

  socket.onMessage(function(message){
    dispatchMessage(JSON.parse(message.data));
  });

  socket.sendMessage = sendMessage;

  return socket;
});*/

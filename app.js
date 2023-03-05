const { GoogleSpreadsheet } = require('google-spreadsheet');

const fs = require('fs');

const RESPONSES_SHEET_ID ='1qqtJEChE-MYR821zvfN8_iK27jetyfTSrbq1VZgQNww'; //Aquí pondras el ID de

const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);

const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json'));

const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');
const { transferableAbortSignal } = require('util');
const { Console } = require('console');

// Pregunta inicial 



// Inicio del Bot 

const flowprueba = addKeyword('Prueba')
.addAnswer('hola Di tu nombre',{capture:true},
async (ctx,{flowDynamic}) =>{
Nombre = ctx.body
flowDynamic()
await flowDynamic({body:`hola ${Nombre}`})
})


const flowprueba2 = addKeyword('CC')
.addAnswer('Escribe tu CC', { capture: true })
.addAnswer(
    '_Validando en la Base de Datos_ 🔎'
)
.addAnswer(
    ['🌸 _Estos son los Datos de tu Crédito_'],{delay:3000}, async (ctx, {flowDynamic}) =>{
        cedula = ctx.body
        
    
        const consultar = await consultarDatosCedula(cedula)
        
        const Nombre = consultadosCC['Nombre'];
        const Deuda = consultadosCC['Deuda'];
        const Fecha = consultadosCC['Fecha'];
        const Monto = consultadosCC['Monto'];
                              
    
        await flowDynamic(`_🔥 *Nombre:* ${Nombre}_\n🔥 _*Total de Deuda:* ${Deuda}_\n🔥 _*Fecha Limite:* ${Fecha}_\n🔥 _*Monto a Pagar:*  ${Monto}_`)
    }
).addAnswer(
    'Si deseas te dejare una opcion para hacer tu pago',{
        buttons:[{body:'Pagar Ahora 🔥'}]
    }
);

const FlowSorteo = addKeyword('Sorteo')
.addAnswer('Pon tu Cedula',{capture:true})
.addAnswer(
    ['🌸 _Consultando_'],{delay:3000}, async (ctx, {flowDynamic}) =>{
        cedula = ctx.body
        
    
        const consultar = await consultarDatosCedula(cedula)
        
        const Sorteo = consultadosCC['Sorteo'];
                                   
    
        await flowDynamic(`_Te informo que ${Sorteo}_`)
    }
)


const Flowbienvenida = addKeyword(['informacion','información','info','hola','holi','buenas','tardes','dias','Bellash 🌸'])
.addAnswer(
    '_Hola_ 😊 🖐🏼',null, (ctx, {flowDynamic}) => {
    console.log('Hay un Usuario en Atencion 🚩')
    nombre = ctx.pushName
    return flowDynamic(`_*${nombre}* para *Bellash* es un honor que nos escribas por este medio, esperamos brindarte la mejor atención posible_ 🌸`)
}
).addAnswer(
   '_*Por favor selecciona una de las siguientes opciones:*_',{
    buttons:[
        {body:'Agendar Cita Primera vez🌸'},
        {body:'Conocer Procedimientos 🌸'},
        {body:'Cómo Llegar 🌸'}
    ]
   }
   
).addAnswer(
    '_*Si ya nos has visitado antes puedes agendar tu cita aqui*_',{
        buttons:[{body:'Cliente VIP 🌸'}]
    }
)


const flowConocer = addKeyword('Conocer Procedimientos 🌸')
.addAnswer('🌸 _*Procedimientos*_ 🌸',{
    media:'https://i.imgur.com/xUoSx0I.png'
})
.addAnswer('Audio',{
    media:'https://firebasestorage.googleapis.com/v0/b/soyberbot-pdkj.appspot.com/o/Audio%20sobre%20Procedimientos.mp3?alt=media&token=d11ae428-b694-45d4-9fd2-3f8ee81fb4ab'
}).addAnswer(
    '🌸 _*Estos son los botones*_ 🌸',{
        buttons:[{body:'Agendar Cita Primera vez🌸'},{body:'Cliente VIP 🌸'}]
    }
)




// FLUJO DINAMICO TOMA DE DATOS Y AGENDAMIENTO DE CITAS //


let STATUS = {}


// Agendamiento 
const flowAgendacita = addKeyword(['Agendar Cita Primera vez🌸','Reagendar 🌸'])
.addAnswer(
    '_*Perfecto!* ¿cúal es su *Nombre*?_ 🌸',{capture:true
    },
async (ctx,{flowDynamic}) =>{
            telefono = ctx.from
            Nombre = STATUS[telefono] ={...STATUS[telefono], nombre: ctx.body}
            Telefono = STATUS[telefono] ={...STATUS[telefono], telefono: ctx.from}
        flowDynamic ()
    }
).addAnswer(
    '_¿cúal es su *Correo*?_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Correo = STATUS[telefono] ={...STATUS[telefono], correo: ctx.body}
flowDynamic()
    }
).addAnswer(
        '_¿Para que dia deseas tu *Cita*? por favor escribe este formato *(Sólo Sábados y Domingos)* *(dd/mm/aaaa)*_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Fecha = STATUS[telefono] = {...STATUS[telefono], fecha: ctx.body}
    
    flowDynamic() 
}
).addAnswer(
'_¿A qué hora deseas tu *Cita*?_ por favor escribe este formato _*(hh:mm am/pm)*_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Hora = STATUS[telefono] = {...STATUS[telefono], hora: ctx.body}   
    
ingresarDatos();  
async function ingresarDatos(){
 console.log('🚩Recibi una Cita para 👉',STATUS[telefono].nombre)
 let rows = [{

 Telefono: STATUS[telefono].telefono,    
 Nombre: STATUS[telefono].nombre,
 Fecha: STATUS[telefono].fecha,
 Hora: STATUS[telefono].hora,
 Correo: STATUS[telefono].correo,




}];

 await doc.useServiceAccountAuth({
         client_email: CREDENTIALS.client_email,
         private_key: CREDENTIALS.private_key
     });
     await doc.loadInfo();
     let sheet = doc.sheetsByIndex[1];
     for (let index = 0; index < rows.length; index++) {
         const row = rows[index];         
         await sheet.addRow(row);};
    
}

flowDynamic()    

await flowDynamic ({body:`_*Excelente!* ☺ pronto confirmaremos tu cita, recuerda consultar las recomendaciones para tu cita en la siguiente opción_ 👇🏼`, buttons:[{body:'🌸 Recomendaciones 🌸'}]})


}
);

const flowVIP = addKeyword(['Cliente VIP 🌸'])
.addAnswer(
    ['🌸 _Danos un segundo mientras validamos tus datos_'],{delay:3000}, async (ctx, {flowDynamic}) =>{
    telefono = ctx.from
    

    const consultar = await consultarDatos2(telefono)
    
    const Nombre = consultados2['Nombre']                      

    await flowDynamic(`🌸 _*${Nombre}* es un placer volverte a tener por aqui_`)


}
).addAnswer(
    '_¿Para que dia deseas tu *Cita*? por favor escribe este formato *(Sólo Sábados y Domingos)* *(dd/mm/aaaa)*_ 🌸',{capture:true},
async (ctx,{flowDynamic}) =>{

telefono = ctx.from
Fecha = STATUS[telefono] = {...STATUS[telefono], fecha : ctx.body}
Telefono = STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}
flowDynamic ()
})
.addAnswer('_¿A qué hora deseas tu *Cita*?_ por favor escribe este formato _*(hh:mm am/pm)*_ 🌸',{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
Hora = STATUS[telefono] = {...STATUS[telefono], hora: ctx.body}   

    
ingresarDatos();  
async function ingresarDatos(){
 console.log('Cita Para',consultados2['Nombre'],'el',STATUS[telefono].fecha)
 let rows = [{

     
 Nombre: consultados2['Nombre'],
 Fecha: STATUS[telefono].fecha,
 Hora: STATUS[telefono].hora,
 Correo: consultados2['Correo'],
 Telefono: STATUS[telefono].telefono




}];

 await doc.useServiceAccountAuth({
         client_email: CREDENTIALS.client_email,
         private_key: CREDENTIALS.private_key
     });
     await doc.loadInfo();
     let sheet = doc.sheetsByIndex[1];
     for (let index = 0; index < rows.length; index++) {
         const row = rows[index];         
         await sheet.addRow(row);};
    
}
flowDynamic()

await flowDynamic ({body:`_*Excelente!* ☺ pronto confirmaremos tu cita, recuerda consultar las recomendaciones para tu cita en la siguiente opción_ 👇🏼`, buttons:[{body:'🌸 Recomendaciones 🌸'}]})


}
)


// Recomendaciones para la Cita

const flowrecomendaciones = addKeyword('🌸 Recomendaciones 🌸')
.addAnswer(
    [
'🚩 _*Recomendaciones*_ 🚩',
'🌸 _Por favor asistir sin maquillaje en los ojos (no rimel)_',
'🌸 _Recuerda que las pestañas no pueden mojarse en las siguientes 24 horas de la aplicación_',
'🌸 _Recuerda confirmar tu cita y programar tu agenda para el tiempo de aplicación (entre 3 y 4 horas)_',
]
).addAnswer(
    '_*Puedes consultar las indicaciones para llegar en la siguiente opción*_ 🌸',{
        buttons:[{body:'Ubicación 🌸'}]
    }
)

// Confirmacion de Citas
const flowConsultar = addKeyword('Consultar')
.addAnswer('_*Validando en la Base de Datos*_ 🔎')
.addAnswer(
    ['🌸 _Estos son los datos de Tu *Cita*_👇🏼'],{delay:3000}, async (ctx, {flowDynamic}) =>{
    telefono = ctx.from
    

    const consultar = await consultarDatos(telefono)
    
    const Nombre = consultados['Nombre']                       
    const Fecha = consultados['Fecha']
    const Hora = consultados['Hora']
    

    await flowDynamic(`🌸 *Nombre*: ${Nombre}\n🌸 *Fecha*: ${Fecha}\n🌸 *Hora*: ${Hora}`)


}
).addAnswer(
    '_¿Esta Todo *Correcto*?_',{capture:true,
    buttons:[
        {
            body:'Confirmar 🌸'
        },
        {
            body:'Cancelar 🌸'
        }
    ]
},
async (ctx,{flowDynamic}) =>{

telefono = ctx.from
Estado = STATUS[telefono] = {...STATUS[telefono], estado : ctx.body}
   
    
ingresarDatos();  
async function ingresarDatos(){
 console.log('Cita de',consultados['Nombre'],STATUS[telefono].estado)
 let rows = [{

     
 Estado: STATUS[telefono].estado,
 Nombre: consultados['Nombre'],
 Fecha: consultados['Fecha'],
 Hora: consultados['Hora'],
 Correo: consultados['Correo']




}];

 await doc.useServiceAccountAuth({
         client_email: CREDENTIALS.client_email,
         private_key: CREDENTIALS.private_key
     });
     await doc.loadInfo();
     let sheet = doc.sheetsByIndex[2];
     for (let index = 0; index < rows.length; index++) {
         const row = rows[index];         
         await sheet.addRow(row);};
    
}
flowDynamic()
}
)



// Mensaje Despues de la Validacion de Cita
const FlowConfirmar = addKeyword('Confirmar 🌸')
.addAnswer(
'_Tu cita se ha confirmado exitosamente, gracias por depositar tu confianza en *Bellash*, te deseamos un excelente día_ 🌸'
)

const FlowCancelar = addKeyword('Cancelar 🌸')
.addAnswer(
'_Lamentamos que no pueda asistir a su cita, sin embargo entendemos que su agenda se vio modificada, si lo desea puede *Reagendar* en el siguiente botón_ 🌸',{
    buttons:[
        {
            body:'Reagendar 🌸'
        }
    ]
}
)


// Base de Datos


const flowbd = addKeyword('Unirme')
.addAnswer(
    '_Genial! para ser parte de la familia *Bellash* sólo debe responder las siguientes preguntas._ 🌸'
)
.addAnswer(
    '_¿Cúal es tu *Nombre y Apellido*?_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Nombre = STATUS[telefono] ={...STATUS[telefono], nombre: ctx.body}
    Telefono = STATUS[telefono] ={...STATUS[telefono], telefono: ctx.from}
flowDynamic()
    }
).addAnswer(
    '_¿Cúal es tu *Correo*?_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Correo = STATUS[telefono] ={...STATUS[telefono], correo: ctx.body}
flowDynamic()
    }
).addAnswer(
    '_¿Cúal es tu *Fecha de Cumpleaños*?_ 🌸',{capture:true},
    async (ctx,{flowDynamic}) =>{
    telefono = ctx.from
    Cumpleaños = STATUS[telefono] ={...STATUS[telefono], cumpleaños: ctx.body}

flowDynamic ()
    }
).addAnswer('_Si tienes una persona que te refirió escribe su *Nombre y Apellido* si no escribenos donde nos conociste_ 🌸',{capture:true},
async (ctx,{flowDynamic}) =>{
telefono = ctx.from
Referida = STATUS[telefono] ={...STATUS[telefono], referida: ctx.body}    

flowDynamic()
ingresarDatos();  
async function ingresarDatos(){
 console.log(STATUS[telefono].nombre,'Es parte de la Familia Bellash 🌸')
 let rows = [{

 Nombre: STATUS[telefono].nombre,
 Correo: STATUS[telefono].correo,
 Cumpleaños: STATUS[telefono].cumpleaños,
 Telefono: STATUS[telefono].telefono,
 Referida: STATUS[telefono].referida
 
 


}];

 await doc.useServiceAccountAuth({
         client_email: CREDENTIALS.client_email,
         private_key: CREDENTIALS.private_key
     });
     await doc.loadInfo();
     let sheet = doc.sheetsByIndex[0];
     for (let index = 0; index < rows.length; index++) {
         const row = rows[index];         
         await sheet.addRow(row);}
}

await flowDynamic ({body:`_Perfecto! ahora eres parte de la familia *Bellash*_ 😊 🌸`, buttons:[{body:'Bellash 🌸'}]})
}
)
// Locacion

const flowLocation = addKeyword('Cómo Llegar 🌸').addAnswer('🌸 _Claro que sí! Está es nuestra ubicación en el barrio La *Castellana* Laureles Medellín_ 🌸', null, async (ctx, { provider }) => {
    const id = ctx.key.remoteJid
    const latitud = "6.242251";
	const longitud ="-75.608236";    
    const abc = await provider.getInstance()    
    await abc.sendMessage(id, { location: { degreesLatitude:latitud, degreesLongitude:longitud } })
    console.log('Envié Ubi 🌸')
    return 
}).addAnswer(
    '🌸 _*Escoje una de estas Opciones*_ 🌸',{
        buttons:[{body:'Agendar Cita Primera vez🌸'},{body:'Cliente VIP 🌸'}]
    }
)


const flowUbi = addKeyword('Ubicación 🌸').addAnswer('🌸 _Claro que sí! Está es nuestra ubicación en el barrio La *Castellana* Laureles Medellín_ 🌸', null, async (ctx, { provider }) => {
    const id = ctx.key.remoteJid
    const latitud = "6.242251";
	const longitud ="-75.608236";    
    const abc = await provider.getInstance()    
    await abc.sendMessage(id, { location: { degreesLatitude:latitud, degreesLongitude:longitud } })
    console.log('Envié Ubi 🌸')
    return 
})

const flowGracias = addKeyword('gracias').addAnswer('_*Gracias!* a ti, espero que te hayas sentido muy bien atendida..._ 🌸')

// FUNCION DE CONSULTA DE DATOS // 

async function consultarDatos(telefono){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Citas Bellash'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
    consultados = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Telefono === telefono) {
           
           
            consultados['Nombre'] = row.Nombre        
            consultados['Correo'] = row.Correo
            consultados['Fecha'] = row.Fecha
            consultados['Hora'] = row.Hora
          


        }
           
}
           
return consultados

};

async function consultarDatos2(telefono){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Base de Datos'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
    consultados2 = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Telefono === telefono) {
           
           
            consultados2['Nombre'] = row.Nombre        
            consultados2['Telefono'] = row.telefono
            consultados2['Fecha'] = row.Fecha
            consultados2['Hora'] = row.Hora
            consultados2['Correo'] = row.Correo
        

        }
           
}
           
return consultados2

};

async function consultarDatosCedula(cedula){
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Cedulas'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA
   
   
   
    consultadosCC = [];




    let rows = await sheet.getRows();
    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.Cedula === cedula) {
           
           
            consultadosCC['Nombre'] = row.Nombre        
            consultadosCC['Deuda'] = row.Deuda
            consultadosCC['Fecha'] = row.Fecha
            consultadosCC['Monto'] = row.Monto
            consultadosCC['Cedula'] = row.Cedula
            consultadosCC['Sorteo'] = row.Sorteo
        

        }
           
}
           
return consultadosCC

};






// FUNCIONES PRINCIPALES // flowValoracion,flowProcedimiento,flowObsequio

async function main() {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowGracias,flowrecomendaciones,flowUbi,flowConocer,flowLocation,flowVIP,flowbd,flowAgendacita,Flowbienvenida,flowConsultar,FlowConfirmar,FlowCancelar,flowprueba])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })


}

main()
// FIN DEL BOT //
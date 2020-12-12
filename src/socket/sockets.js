import {io} from '../index'
import {saveBeltStatus} from '../controllers/sockets/beltStatus'
import Door from '../models/Door'
import {saveDoorStatus,getDoors} from '../controllers/sockets//doorStatus'
import {saveWindowStatus} from '../controllers/sockets/windowStatus'
import {saveHumidityRead} from '../controllers/sockets/humidityRead'
import {saveTemperatureRead} from '../controllers/sockets/temperatureRead'
import {saveWhaterRead} from '../controllers/sockets/whaterRead'
import {saveFoodRead} from '../controllers/sockets/foodRead'

import {sendPushNotifications} from '../controllers/sockets/pushNotification'

import {getFarm} from '../controllers/sockets/farm'
import Farm from '../models/Farm'

import {checkJWT} from '../controllers/jwt'
import {extractToken} from '../controllers/sockets/tokenExtract'

import * as cron from 'node-cron'

export const socket = ()=>{

    io.on('connection',async(socket) =>{
        console.log('Usuario conectad'+socket.id)
        const token = extractToken(socket.handshake.headers.authorization)

        let [valid,id] = ["",""]

        if(token.length >= 30){

            [valid,id] = checkJWT(token)
        }else{
            id = token
            valid = true
        }
        
        console.log(id)
    
        if(!valid) return socket.disconnect()

        const farm = await getFarm(id)

        // room by user id
        socket.join(id)
        const date = `${farm.close_doors.getMinutes()} ${farm.close_doors.getHours()+4} * * *`
        console.log(date)
        //const date = "40 1 * * * "
        cron.schedule(date,async()=>{

            const doors = await getDoors(farm._id)
            for(const door in doors){
                let data = {
                    door : doors[door].id,
                    status : false
                }
                console.log(doors[door])
                io.to(id).emit("door",JSON.stringify(data))
            }
        })

        socket.on('disconnect',()=>{
            console.log('Usuario desconectado'+socket.id+socket.handshake.headers.origin)
        })
    
        socket.on("belt",async(payload)=>{
            //await saveBeltStatus(payload)
            io.to(id).emit("belt",JSON.stringify(payload))
            console.log(JSON.stringify(payload))
        })
    
        socket.on("window",async(payload)=>{
            //await saveWindowStatus(payload)
            io.to(id).emit('window',JSON.stringify(payload))
            console.log(JSON.stringify(payload))
        })
    
        socket.on("door",async(payload)=>{
            //await saveDoorStatus(payload)
            io.to(id).emit("door",JSON.stringify(payload))
            console.log(JSON.stringify(payload))
        })
    
       socket.on("humidity",async(payload)=>{
            //await saveHumidityRead(payload)
            if(payload.humidity >= 65){
                await sendPushNotifications(id,`Humedad alta` ,`La humedad en el ambiente es de: ${payload.humidity}%`)
            }
            io.to(id).emit("humidity",JSON.stringify(payload))
            console.log(JSON.stringify(payload))
       }) 

       socket.on("temperature",async(payload)=> {
            //await saveHumidityRead(payload)
            if(payload.temperature >= 23){
                await sendPushNotifications(id,"Temperatura alta",`La temperatura en el ambiente es de: ${payload.temperature}%`)             
            }
            io.to(id).emit("temperature",JSON.stringify(payload))
            console.log(payload)
       })

       socket.on("whater",async(payload)=>{
            //await saveWhaterRead(payload)
            if(payload.whater <= 20){
                await sendPushNotifications(id,"Reservas de agua Bajas",`La reserva de agua es de: ${payload.whather}%`)                
            }
            io.to(id).emit("whater",JSON.stringify(payload))
            console.log(payload)
       }) 

       socket.on("food",async(payload)=>{
            //await saveFoodRead(payload)
            if(payload.food <= 20){
                await sendPushNotifications(id,"Reservas de comida Bajas",`La reserva de comida es de: ${payload.food}%`) 
            }
            io.to(id).emit("food",JSON.stringify(payload))
            console.log(payload)
       })

    })
    
} 


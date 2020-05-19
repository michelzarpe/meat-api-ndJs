import * as mongoose from 'mongoose';
import { enviroment } from '../common/enviroment';
//criar esquema

export interface MenuItem extends mongoose.Document{
    name :string,
    price: number
}

export interface Restaurant extends mongoose.Document{
    name: string, 
    menu: MenuItem[]
}

const menuSchema = new mongoose.Schema({
    name : {
        type: String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

const restSchema = new mongoose.Schema({
    name : {
        type: String,
        required:true
    },
    menu : {
        type: [menuSchema],
        required:false,
        select:false        //nao trazer o menu quando buscar
    }   
})

//registrar os documentos atravez desse esquema com a tipagem conforme a inteface criada Restaurant
export const Restaurant = mongoose.model<Restaurant>('Restaurant',restSchema);
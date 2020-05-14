import * as mongoose from 'mongoose';
//criar esquema

export interface User extends mongoose.Document{
    nome: string, 
    email: string,
    password:string
}

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        select:false //para nao trazer o campo em um select normal
    }
})

//registrar os documentos atravez desse esquema com a tipagem conforme a inteface criada User
export const User = mongoose.model<User>('User',userSchema);
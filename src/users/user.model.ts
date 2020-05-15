import * as mongoose from 'mongoose';
//criar esquema

export interface User extends mongoose.Document{
    nome: string, 
    email: string,
    password:string
}

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        maxlength:80,
        minlength:3
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password:{
        type:String,
        required:true,// requerido para inserir a informação no banco
        select:false //para nao trazer o campo em um select normal
    }, 
    gender:{
        type:String,
        require:false,
        enum: ['Male','Famale']
    }
})

//registrar os documentos atravez desse esquema com a tipagem conforme a inteface criada User
export const User = mongoose.model<User>('User',userSchema);
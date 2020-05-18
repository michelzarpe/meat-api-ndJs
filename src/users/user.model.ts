import { validateCPF } from './../common/validators';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { enviroment } from '../common/enviroment';
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
    },
    cpf:{
        type:String,
        required:true,
        validate: {
            validator: validateCPF,
            message: '{PATH} Invalid Cpf ({VALUE})'
        }
    }
})

//middleware pre no save, não usar arrow function
userSchema.pre('save',function(next){
    //usar o this porque ele presenta o documento
    const user: User = this;
    if(!user.isModified('password')){//quando doc for novo ou nao alterar um doc existente
        next();
    }else{
        bcrypt.hash(user.password,enviroment.security.saltRounds).then(hash=>{
            user.password = hash;
            next();
        }).catch(next);
    }
})

//middleware pre no save, não usar arrow function
userSchema.pre('findOneAndUpdate',function(next){
    //usar o this porque ele presenta o documento
    const user: User = this;
    if(!this.getUpdate().password){//quando doc for novo ou nao alterar um doc existente
        next();
    }else{
        bcrypt.hash(this.getUpdate().password,enviroment.security.saltRounds).then(hash=>{
            this.getUpdate().password = hash;
            next();
        }).catch(next);
    }
})


//registrar os documentos atravez desse esquema com a tipagem conforme a inteface criada User
export const User = mongoose.model<User>('User',userSchema);
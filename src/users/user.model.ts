const users = [
    {id: '1', name:'Petter Parker', email:'peter@marver.com'},
    {id: '2', name:'Bruce Wayne', email:'bruce@dc.com'}
]

export class User {
    static findAll():Promise<any>{
        return Promise.resolve(users);
    }
    static findByID(id:string):Promise<any>{
        return new Promise(resolve=>{
            const filtered = users.filter(user=> user.id ===id);
            let user = undefined;
            if(filtered.length>0){
                user = filtered[0];
            }
            resolve(user)
        });
    }
}
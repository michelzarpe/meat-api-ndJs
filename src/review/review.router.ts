import { Review } from './review.model';
import {ModelRouter} from './../common/model-router';
import * as restify from 'restify';

class ReviewRouter extends ModelRouter<Review>{
    constructor(){
        super(Review)
    }

    
    findById = (req,resp,next)=>{
        this.model.findById(req.params.id)
        .populate('user')
        .populate('restaurante')
        .then(this.render(resp,next))
        .catch(next);
     }

    apllyRoutes(application:restify.Server){
        application.get('/review',this.findAll);
        application.get('/review/:id',[this.validateId,this.findById]);
        application.post('/review',this.save);
    }
}

export const reviewRouter = new ReviewRouter();
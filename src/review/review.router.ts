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
        application.get(`${this.basePath}`,this.findAll);
        application.get(`${this.basePath}/:id`,[this.validateId,this.findById]);
        application.post(`${this.basePath}`,this.save);
    }
}

export const reviewRouter = new ReviewRouter();
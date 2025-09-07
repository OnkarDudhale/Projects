//Catch error if not Proceed With main flow
function wrapAsync(fn){
    return(req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            next(err);
        });
    }
}

module.exports=wrapAsync;
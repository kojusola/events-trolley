const customerModel = require('../../../models/user/customer.auth.model');
const vendorModel = require('../../../models/user/vendor.auth.model');

exports.userProfile = async(req, res) => {
    const _id = req.userId
    if(!_id) return false;
   var existAsProfile = await customerModel.exists({_id}, async (error, data)=>{
       if(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Can not find data',
            data: null,
            statusCode: 500
       })
    }
    if(data){
        const customerProfile = await customerModel.findOne({_id},(error, data)=>{
             if(error){
                 console.log(error);
                 res.status(500).send({
                     status: false,
                     msg: 'Can not find data',
                     data: null,
                     statusCode: 500
             });
         }
     });
     res.json({success:"hello",user:customerProfile});
 }
         if(!data){
             const vendorProfile = await vendorModel.findOne({_id},(error, data)=>{
                  if(error){
                      console.log(error);
                      res.status(500).send({
                          status: false,
                          msg: 'Can not find data',
                          data: null,
                          statusCode: 500
                  });
              }
         });
         res.json({user: vendorProfile});
         }
});
}     

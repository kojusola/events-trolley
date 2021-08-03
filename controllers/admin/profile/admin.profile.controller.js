const adminUserModel = require('../../../models/admin/admin.auth.model');
const ticketModel = require('../../../models/user/ticket.model');
const ticketBoughtModel = require('../../../models/user/ticketsBought');
const accountModel = require('../../../models/user/account.model');
const profileModel = require('../../../models/user/profile.model');

exports.adminProfile = async(req, res) => {
    const _id = req.userId
    if(!_id) return false;
  const adminPage = await adminUserModel.findOne({_id},(error, data)=>{
        if(error){
            console.log(error);
            res.status(500).send({
                status: false,
                msg: 'Can not find data',
                data: null,
                statusCode: 500
        })
    }
    })
    res.json({admin:adminPage});
};

exports.overview= async(req, res) => {
    try{
        const ticket = await ticketModel.countDocuments({functions(err, count){
            if(err){
                console.log(err)
            } else{
                console.log(count)
            }
            }});
        const ticketsBought = await ticketBoughtModel.countDocuments({functions(err, count){
            if(err){
                console.log(err)
            } else{
                console.log(count)
            }
            }});
        const vendors = await profileModel.find({role: "vendor"}).countDocuments({functions(err, count){
            if(err){
                console.log(err)
            } else{
                console.log(count)
            }
            }});
        const customers = await profileModel.find({role: "customer"}).countDocuments({functions(err, count){
            if(err){
                console.log(err)
            } else{
                console.log(count)
            }
            }});
        const bestSellingTickets = await ticketBoughtModel.aggregate([{$group:{_id:"$ticketId",total_tickets:{$sum:1}}},
        {$sort:{total_tickets: -1}}]).allowDiskUse(true);
        const Revenue = await accountModel.findOne({userId:"admin"});
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket request successful.',
                data: {
                    ticket,
                    ticketsBought,
                    vendors,
                    customers,
                    revenue:Revenue.balance,
                    bestSellingTickets
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'Ticket does not exist.',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}
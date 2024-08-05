const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../../models/auth/super-admin/index')
const bcrypt = require('bcrypt')
exports.SuperAdminSignin = async(req, res)=>{
    const {email, password} = req.body;
    try {
        const superAdmin = await SuperAdmin.findOne({email})
        if(!superAdmin) return res.status(400).json({msg: "SuperAdmin does not exist with this email, please try another email."})    
        const isMatch = await bcrypt.compare(password, superAdmin.password)
        if(!isMatch){
            return res.status(400).json({msg: "Incorrect Password"})   
        }
        const payload = {name : superAdmin.name, email: superAdmin.email, role: superAdmin.role, isActive :superAdmin.isActive
        }
    const token = jwt.sign(payload, secret, {expiresIn : "1h"})
    return res.status(200).json({msg: "Super admin Login Successfully", data: payload, token})
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Server Error"})
    
}
}
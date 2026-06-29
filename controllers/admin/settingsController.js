import Settings from "../../models/Settings.js";

export const getSettings =
async(req,res)=>{

  try{

    let settings =
      await Settings.findOne();

    if(!settings){

      settings =
        await Settings.create({});
    }

    res.status(200).json({
      success:true,
      settings
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const updateSettings =
async(req,res)=>{

  try{

    let settings =
      await Settings.findOne();

    if(!settings){

      settings =
        await Settings.create({});
    }

    settings =
      await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new:true
        }
      );

    res.status(200).json({

      success:true,

      message:
        "Settings Updated",

      settings

    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
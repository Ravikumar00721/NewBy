const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'doo34cgwh', 
  api_key: '727288416498795', 
  api_secret: 'XYHgcv1ae5nq7ZyaZkrAPb5T0lM' 
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpeg','png','jpg']
    }
});

module.exports={
    cloudinary,
    storage
}
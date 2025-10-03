
import StarRating from "./StarRating";
import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Card = ({course}) => {
    const getPublicId = (url) => {
        const parts = url.split('/');
        const fileWithExtension = parts[parts.length - 1];
        const fileName = fileWithExtension.split('.')[0];
        const versionIndex = parts.findIndex(part => part.startsWith('v'));
        const publicIdParts = parts.slice(versionIndex + 1, parts.length - 1).concat(fileName);
        return publicIdParts.join('/');
    };
    // const CourseImage = ({ imageUrl }) => {
    //     const cld = new Cloudinary({ cloud: { cloudName: 'dt3xvmjfb' } });
    //     const publicId = getPublicId(imageUrl);
    //     const myImage = cld.image(publicId);
    //     myImage.resize(fill().width(250).height(250));
    //     return <AdvancedImage cldImg={myImage} className="course-img" />;
    // };
    const {linkImg,title,category,rating,price}=course;
    return (
        <div className="bg-white drop-shadow-md overflow-hidden rounded-2xl mx-1 my-4 cursor-pointer">
           <img src={"http://localhost:8000/" + linkImg} className="h-40 w-full object-cover  " />
           <div className="p-5 border-b">
                <h1 className="py-2 truncate  " title={title}>{title}</h1>
                <StarRating  rating={rating}/>
               
           </div>
           <h3 className="p-5 text-xl">₹{price}</h3>
            <div className="absolute top-0 bg-white m-3 px-3 py-[2.5px] rounded font-bold ">
                {category}
            </div> 
        </div>
    );
};

export default Card;
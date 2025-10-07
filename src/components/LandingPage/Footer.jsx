import React from "react";
import { logo } from '../../assets'
import {FaFacebookF,FaDribbble,FaLinkedinIn,FaInstagram} from 'react-icons/fa'
import { IoGlobeSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
return (
        <div className='w-full bg-white'>
                <div className='md:max-w-[1480px] grid md:grid-cols-4 max-[780px]:grid-cols-2  gap-8 max-w-[600px]  px-4 md:px-0'>
                        <div className='col-span-1'>
                                <img src={logo} className="h-[200px]" />
                                <h3 className='text-2xl font-bold mt-10'>Contact Us</h3>
                                <h3 className='py-2 text-[#6D737A]'>Call : 91+ 95001 01075</h3>
                                <h3 className='py-2 text-[#6D737A]'>45, Marudupandiar Rd, Kamarajapuram, Velacheri Lake <br></br>  Velachery, Chennai, Tamil Nadu 600042</h3>
                                {/* <h3 className='py-2 text-[#363A3D]'>Email: info@greatmindstechnology.in</h3> */}
                                <div className='flex gap-4 py-4'>
                                        <div 
                                                className='p-4 bg-[#e9eff8b2] rounded-xl' 
                                                title="Facebook"
                                        >
                                                <FaFacebookF size={25} style={{color:'#204fb4'}} />
                                        </div>
                                        <div 
                                                        className='p-4 bg-[#e9eff8b2] rounded-xl' 
                                                        title="LinkedIn"
                                                        onClick={() => window.open("https://www.linkedin.com/company/14558831/admin/", "_blank")}
                                        >
                                                        <FaLinkedinIn size={25} style={{color:'#204fb4'}} alt="LinkedIn" />
                                        </div>
                                        <div 
                                                className='p-4 bg-[#e9eff8b2] rounded-xl' 
                                                title="Twitter"
                                                onClick={() => window.open("https://x.com/Greatmindstech1", "_blank")}>
                                                        <FaSquareXTwitter size={25} style={{color:'#204fb4'}} alt="Twitter" />
                                        </div>
                                        <div 
                                                className='p-4 bg-[#e9eff8b2] rounded-xl' 
                                                title="Website"
                                                onClick={() => window.open("https://greatmindstechnology.in", "_blank")}>
                                                        <IoGlobeSharp size={25} style={{color:'#204fb4'}} alt="Website" />
                                        </div>
                                        <div 
                                                className='p-4 bg-[#e9eff8b2] rounded-xl' 
                                                title="Email"
                                                onClick={() => window.location.href = "mailto:info@greatmindstechnology.in"}>
                                                        <MdEmail  size={25} style={{color:'#204fb4'}} alt="Email" />
                                        </div>
                                </div>
                        </div> 
                        <div className='md:col-span-1 md:col-start-3 align-self-center'>
                                <div 
                                        onClick={() => window.open("https://www.google.com/maps/place/45,+Marudupandiar+Rd,+Kamarajapuram,+Velacheri+Lake,+Velachery,+Chennai,+Tamil+Nadu+600042", "_blank")}
                                        style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden',width: '200%' }}
                                >
                                        <iframe
                                                title="Google Maps Location"
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d762.241247335009!2d80.21552769183383!3d12.98866149598953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52676727b15555%3A0x4c37dba9694410b7!2sGreat%20Minds%20Technology!5e1!3m2!1sen!2sin!4v1750066321483!5m2!1sen!2sin"
                                                height="300"
                                                style={{ pointerEvents: 'none', border: 0, width: '200%' }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                </div>
                        </div>
                </div>
        </div>
)
}

export default Footer